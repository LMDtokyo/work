using MediatR;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Wildberries.Commands;

public sealed record RemoveWbAccountCommand(Guid UserId, Guid AccountId) : IRequest<Result>;

internal sealed class RemoveWbAccountCommandHandler : IRequestHandler<RemoveWbAccountCommand, Result>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveWbAccountCommandHandler(
        IWbAccountRepository accountRepository,
        IUnitOfWork unitOfWork)
    {
        _accountRepository = accountRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(RemoveWbAccountCommand request, CancellationToken ct)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId, request.UserId, ct);
        if (account is null)
            return Result.Failure("Аккаунт не найден или у вас нет прав на его удаление");

        _accountRepository.Delete(account);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result.Success();
    }
}
