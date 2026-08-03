# Envio automático de relatórios por e-mail (Gmail)

## Como funciona, em uma frase

O dashboard continua exportando os PDFs do jeito que já funciona hoje (botão
"Imprimir em PDF"); um script na sua conta Google (Google Apps Script) roda
sozinho todo dia num horário fixo, olha os PDFs que apareceram numa pasta do
Google Drive, descobre pelo **nome do arquivo** quem é o destinatário, e manda
o e-mail com o PDF em anexo pelo seu Gmail.

Importante: **quem ainda depende de alguém abrir o dashboard e clicar em
exportar é a geração do PDF.** O que roda 100% sozinho, sem abrir nada, é o
envio a partir do momento que o PDF está na pasta do Drive.

O nome do arquivo já segue o padrão `dd.mm.aa.Dir <DDD>[.Ger|.Sup|.Vend].<Nome>`
(mesmo padrão usado hoje no botão de exportar) — é dele que o script tira quem
é o destinatário.

---

## Passo 1 — Criar as pastas no Google Drive

1. No Google Drive, crie uma pasta, por exemplo **"Indicadores — envio automático"**.
2. Dentro dela, crie duas subpastas: **"Enviados"** e **"Revisar"**.
3. Abra cada uma das 3 pastas no navegador e copie o ID de cada uma a partir
   da URL: `https://drive.google.com/drive/folders/AQUI_ESTÁ_O_ID`.

## Passo 2 — Criar a planilha de e-mails

1. Crie uma Planilha Google nova (Google Sheets), por exemplo **"Cadastro de
   e-mails — Indicadores"**.
2. Renomeie a primeira aba para **`E-mails`** e importe o arquivo
   [`modelo-planilha-emails.csv`](./modelo-planilha-emails.csv) desta pasta
   (Arquivo → Importar → Fazer upload → Substituir planilha atual/aba), ou
   simplesmente copie as colunas: `Nível | Nome | E-mail | Ativo`.
3. Preencha uma linha para **cada** Diretoria, Gerente, Supervisor e Vendedor
   que deve receber relatório. O campo **Nome** tem que ser **idêntico** ao
   que aparece no nome do arquivo exportado (mesmo texto que está na
   hierarquia importada no dashboard — para Diretoria, o "Nome" é o próprio
   DDD, ex.: `BH`). Maiúsculas/minúsculas e acentos não importam (o script
   ignora isso), mas o texto em si precisa ser o mesmo.
4. Deixe `Ativo` como `TRUE`; mude para `FALSE` se quiser suspender o envio
   pra alguém sem apagar a linha.
5. Copie o **ID da planilha** a partir da URL:
   `https://docs.google.com/spreadsheets/d/AQUI_ESTÁ_O_ID/edit`.

## Passo 3 — Criar o projeto Apps Script

1. Acesse [script.google.com](https://script.google.com) → **Novo projeto**.
2. Dê um nome, ex.: **"Envio automático — Indicadores RedeFlex"**.
3. Apague o conteúdo padrão de `Code.gs` e cole o conteúdo do arquivo
   [`EnvioAutomaticoEmails.gs`](./EnvioAutomaticoEmails.gs) desta pasta.
4. No topo do código, preencha as constantes com os IDs copiados nos passos
   1 e 2, e coloque seu e-mail em `EMAIL_ADMIN` (é pra onde vai o aviso
   sempre que algum arquivo não puder ser enviado).
5. Salve (Ctrl+S / ícone de disquete).

## Passo 4 — Autorizar e testar manualmente

1. No editor, selecione a função `enviarRelatoriosPendentes` no menu
   suspenso ao lado do botão **Executar** e clique em **Executar**.
2. Na primeira vez, o Google vai pedir autorização — permissões de Drive,
   Planilhas e Gmail da sua própria conta. Aceite (é normal aparecer um
   aviso de "app não verificado" por ser um script pessoal seu; clique em
   "Avançado" → "Acessar [nome do projeto] (não seguro)").
3. Teste de ponta a ponta antes de agendar:
   - Exporte um PDF pelo dashboard (botão "Imprimir em PDF") escolhendo como
     destino a pasta do Drive do Passo 1 (se você tiver o Google Drive para
     computador instalado, ela aparece como uma pasta normal no seletor).
   - Confirme que o nome dessa pessoa/nível está cadastrado na planilha de
     e-mails com o e-mail certo.
   - Rode `enviarRelatoriosPendentes` de novo pelo editor e confira: o
     e-mail chegou, o arquivo foi para "Enviados", e a aba `Log envios` (é
     criada sozinha na planilha) registrou a linha.
   - Teste também o caminho de erro: exporte um PDF de alguém que **não**
     está na planilha e confirme que ele vai parar em "Revisar" e que você
     recebeu o aviso em `EMAIL_ADMIN`.

## Passo 5 — Agendar

1. Ainda no editor do Apps Script, selecione a função `criarGatilhoDiario`
   no menu suspenso e clique em **Executar** — isso cria o agendamento
   (por padrão, todo dia às 8h).
2. Pra conferir ou mudar o horário depois, vá no ícone de relógio
   (**Gatilhos**) no menu lateral do editor.
3. Se quiser outra frequência (ex.: só segundas-feiras), ajuste a função
   `criarGatilhoDiario` no código antes de rodar de novo — o próprio código
   tem um comentário explicando onde mexer — e rode-a novamente (ela
   substitui o gatilho anterior automaticamente).

---

## Perguntas prováveis

**Preciso deixar o computador ligado?** Não — a partir do agendamento, o
script roda nos servidores do Google, mesmo com o PC desligado. Só a
geração do PDF (exportar pelo dashboard) depende de alguém abrir o arquivo.

**E se eu exportar de novo o mesmo mês/pessoa?** O nome do arquivo muda
todo dia (o `dd.mm.aa` é a data da exportação), então não há risco de sobrescrever
um já enviado — mas também não há uma trava contra mandar duas vezes no
mesmo dia se você exportar duas vezes.

**Onde vejo o histórico de envios?** Na aba `Log envios` da planilha de
e-mails — data/hora, arquivo, nível, nome, e-mail e status de cada
tentativa.
