import { PrismaClient } from "@prisma/client";

type DashboardSummary = {
  totals: {
    uploads: number;
    users: number;
    comments: number;
    shares: number;
    downloads: number;
    alerts: number;
  };
  trends: {
    labels: string[];
    shares: number[];
    downloads: number[];
  };
  categories: Array<{ label: string; value: number }>;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    downloads: number;
  };
};

type TrendRow = { day: Date; total: number };

export class AdminDashboardService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getDashboardSummary(days = 10): Promise<DashboardSummary> {
    const [
      uploads,
      users,
      comments,
      shares,
      downloads,
      alerts,
      likes,
      shareRows,
      downloadRows,
      categories,
    ] = await Promise.all([
      this.prisma.video.count(),
      this.prisma.user.count(),
      this.prisma.comment.count({ where: { isDeleted: false } }),
      this.prisma.videoShareEvent.count(),
      this.prisma.videoDownloadEvent.count(),
      this.prisma.notification.count({ where: { isRead: false } }),
      this.prisma.videoLike.count(),
      this.getDailyCounts("VideoShareEvent", days),
      this.getDailyCounts("VideoDownloadEvent", days),
      this.prisma.category.findMany({
        select: { name: true, _count: { select: { videos: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

    const { labels, sharesSeries } = this.buildSeries(shareRows, days);
    const downloadsSeries = this.buildSeries(downloadRows, days).sharesSeries;

    return {
      totals: {
        uploads,
        users,
        comments,
        shares,
        downloads,
        alerts,
      },
      trends: {
        labels,
        shares: sharesSeries,
        downloads: downloadsSeries,
      },
      categories: categories.map((cat) => ({
        label: cat.name,
        value: cat._count.videos,
      })),
      engagement: {
        likes,
        shares,
        comments,
        downloads,
      },
    };
  }

  private async getDailyCounts(table: "VideoShareEvent" | "VideoDownloadEvent", days: number): Promise<TrendRow[]> {
    const daysInterval = Math.max(1, days - 1);
    const query = `
      SELECT date_trunc('day', "createdAt") as day, COUNT(*)::int as total
      FROM "${table}"
      WHERE "createdAt" >= now() - interval '${daysInterval} days'
      GROUP BY day
      ORDER BY day
    `;
    return await this.prisma.$queryRawUnsafe<TrendRow[]>(query);
  }

  private buildSeries(rows: TrendRow[], days: number): { labels: string[]; sharesSeries: number[] } {
    const map = new Map<string, number>();
    rows.forEach((row) => {
      const key = this.toDateKey(new Date(row.day));
      map.set(key, Number(row.total));
    });

    const labels: string[] = [];
    const series: number[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = this.toDateKey(date);
      labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      series.push(map.get(key) ?? 0);
    }

    return { labels, sharesSeries: series };
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
