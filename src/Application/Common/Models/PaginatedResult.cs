namespace MessagingPlatform.Application.Common.Models;

public sealed class PaginatedResult<T>
{
    public IReadOnlyList<T> Items { get; }
    public int TotalCount { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    private PaginatedResult(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }

    public static PaginatedResult<T> Create(IReadOnlyList<T> items, int totalCount, int skip, int take)
    {
        var page = take > 0 ? (skip / take) + 1 : 1;
        return new PaginatedResult<T>(items, totalCount, page, take > 0 ? take : items.Count);
    }
}
