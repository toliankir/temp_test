export class PaginationDtoResponse {
  public readonly page: number;
  public readonly totalPages: number;
  public readonly totalUsers: number;
  public readonly count: number;
  public readonly links: {
    readonly nextUrl: string | null;
    readonly prevUrl: string | null;
  };
}
