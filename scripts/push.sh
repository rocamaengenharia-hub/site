#!/usr/bin/env bash
# Commit + push para github.com/rocamaengenharia-hub/site como rocamaengenharia-hub.
#
# Uso:
#   ./scripts/push.sh "fix: ajusta banner"   # commita tudo que mudou e dá push
#   ./scripts/push.sh                        # só dá push dos commits que já existem
#
# O token NUNCA fica neste arquivo (o repo é público: token commitado vira
# acesso de qualquer pessoa à conta). Ordem de busca:
#   1. variável de ambiente ROCAMA_GH_TOKEN
#   2. Keychain do macOS, se você salvou lá uma vez com:
#        security add-generic-password -U -a rocamaengenharia-hub -s github-rocama-site -w
#   3. pergunta na hora (o que você cola não aparece na tela)
set -euo pipefail

REPO_URL="https://github.com/rocamaengenharia-hub/site.git"
REMOTE="rocama"
BRANCH="main"
GH_USER="rocamaengenharia-hub"
GH_EMAIL="350290794+rocamaengenharia-hub@users.noreply.github.com"

cd "$(git rev-parse --show-toplevel)"
msg="${1:-}"

token="${ROCAMA_GH_TOKEN:-}"
if [[ -z "$token" ]] && command -v security >/dev/null 2>&1; then
    token="$(security find-generic-password -a "$GH_USER" -s github-rocama-site -w 2>/dev/null || true)"
fi
if [[ -z "$token" ]]; then
    read -rsp "Token do GitHub ($GH_USER): " token
    echo
fi
[[ -n "$token" ]] || { echo "Sem token, nada foi feito."; exit 1; }

git config user.name "$GH_USER"
git config user.email "$GH_EMAIL"
git remote get-url "$REMOTE" >/dev/null 2>&1 || git remote add "$REMOTE" "$REPO_URL"

if [[ -n "$(git status --porcelain)" ]]; then
    if [[ -z "$msg" ]]; then
        echo 'Há alterações não commitadas. Passe a mensagem: ./scripts/push.sh "fix: ajusta banner"'
        exit 1
    fi

    git add -A

    # Repo público: aborta se algum arquivo .env ou algo com cara de chave entrou no commit
    if git diff --cached --name-only | grep -qE '(^|/)\.env'; then
        git reset -q
        echo "Abortado: arquivo .env no commit. Nada foi commitado."
        exit 1
    fi
    if git diff --cached -U0 | grep -E '^\+' | grep -qE 'ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|eyJhbGciOi|sb_secret_'; then
        git reset -q
        echo "Abortado: parece ter token ou chave nos arquivos. Nada foi commitado."
        exit 1
    fi

    echo "Arquivos no commit:"
    git diff --cached --name-status
    git commit -q -m "$msg"
fi

# O token chega ao git por variável de ambiente: não vai para a URL, para o
# .git/config nem para a lista de processos. Os helpers vazios desligam os
# logins já salvos na máquina (gh/osxkeychain), que são de outras contas.
export ROCAMA_GH_TOKEN="$token"
git -c credential.helper= \
    -c credential.https://github.com.helper= \
    -c "credential.helper=!f() { test \"\$1\" = get || exit 0; echo username=$GH_USER; echo \"password=\${ROCAMA_GH_TOKEN}\"; }; f" \
    push -u "$REMOTE" "$BRANCH"

echo "Pronto: https://github.com/rocamaengenharia-hub/site"
