/**
 * Envio automático de relatórios em PDF por e-mail — Dashboard Indicadores (RedeFlex)
 *
 * O que este script faz, sozinho, sem precisar abrir nada:
 *  1. Lê os PDFs pendentes numa pasta do Google Drive (a mesma pasta onde o
 *     dashboard.html exporta os relatórios — ver "Imprimir em PDF").
 *  2. Descobre quem deve receber cada PDF a partir do NOME DO ARQUIVO
 *     (padrão: dd.mm.aa.Dir <DDD>[.Ger|.Sup|.Vend].<Nome>.pdf) cruzado com
 *     a planilha de e-mails.
 *  3. Envia o e-mail com o PDF em anexo pelo Gmail da conta dona deste script.
 *  4. Move o arquivo para "Enviados" (sucesso) ou "Revisar" (nome fora do
 *     padrão / e-mail não cadastrado) e registra tudo na aba "Log envios".
 *
 * Como instalar: ver LEIA-ME.md nesta mesma pasta.
 */

/* ===================== CONFIGURAÇÃO (preencha antes de rodar) =========== */
const ID_PASTA_PENDENTES = 'COLE_AQUI_O_ID_DA_PASTA_DE_EXPORTACAO';
const ID_PASTA_ENVIADOS  = 'COLE_AQUI_O_ID_DA_SUBPASTA_ENVIADOS';
const ID_PASTA_REVISAR   = 'COLE_AQUI_O_ID_DA_SUBPASTA_REVISAR';
const ID_PLANILHA_EMAILS = 'COLE_AQUI_O_ID_DA_PLANILHA';
const ABA_EMAILS         = 'E-mails';
const ABA_LOG            = 'Log envios';
const EMAIL_ADMIN        = 'seu-email@gmail.com'; // recebe o resumo de falhas a cada execução
/* ========================================================================= */

const MES_NOME = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/* Função principal — é ela que o gatilho agendado (criarGatilhoDiario) chama. */
function enviarRelatoriosPendentes() {
  const pastaPendentes = DriveApp.getFolderById(ID_PASTA_PENDENTES);
  const pastaEnviados  = DriveApp.getFolderById(ID_PASTA_ENVIADOS);
  const pastaRevisar   = DriveApp.getFolderById(ID_PASTA_REVISAR);
  const planilha       = SpreadsheetApp.openById(ID_PLANILHA_EMAILS);
  const mapaEmails     = carregarMapaEmails(planilha);
  const abaLog         = planilha.getSheetByName(ABA_LOG) || planilha.insertSheet(ABA_LOG);

  const falhas = [];
  const arquivos = pastaPendentes.getFilesByType(MimeType.PDF);
  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    const resultado = processarArquivo(arquivo, mapaEmails, pastaEnviados, pastaRevisar);
    abaLog.appendRow([new Date(), arquivo.getName(), resultado.nivel || '', resultado.nome || '',
      resultado.email || '', resultado.status, resultado.detalhe || '']);
    if (resultado.status !== 'Enviado') falhas.push(arquivo.getName() + ' — ' + resultado.detalhe);
  }

  if (falhas.length && EMAIL_ADMIN) {
    GmailApp.sendEmail(
      EMAIL_ADMIN,
      'Envio automático de indicadores — ' + falhas.length + ' arquivo(s) não enviado(s)',
      'Os arquivos abaixo não puderam ser enviados automaticamente:\n\n' + falhas.join('\n') +
      '\n\nEles foram movidos para a pasta "Revisar" no Drive — corrija (nome do arquivo ou\n' +
      'cadastro de e-mail) e mova de volta para a pasta pendente pra tentar de novo.'
    );
  }
}

/* Um arquivo por vez: identifica o destinatário, envia e move pro lugar certo. */
function processarArquivo(arquivo, mapaEmails, pastaEnviados, pastaRevisar) {
  const nomeSemExt = arquivo.getName().replace(/\.pdf$/i, '');
  const info = analisarNomeArquivo(nomeSemExt);
  if (!info) {
    arquivo.moveTo(pastaRevisar);
    return { status: 'Falhou', detalhe: 'Nome de arquivo fora do padrão esperado' };
  }

  const chave = normalizar(info.nivel) + '|' + normalizar(info.nome);
  const email = mapaEmails[chave];
  if (!email) {
    arquivo.moveTo(pastaRevisar);
    return { nivel: info.nivel, nome: info.nome, status: 'Falhou',
      detalhe: 'E-mail não cadastrado para "' + info.nome + '" (' + info.nivel + ')' };
  }

  try {
    const mesAno = mesAnoPorDataArquivo(info.dataStr);
    const assunto = 'Relatório de Indicadores — ' + info.nivel + ' ' + info.nome + ' — ' + mesAno;
    const corpo = 'Olá,\n\nSegue em anexo o relatório de indicadores referente a ' + mesAno + '.\n\n' +
      'Este e-mail foi enviado automaticamente pelo sistema de indicadores.';
    GmailApp.sendEmail(email, assunto, corpo, {
      attachments: [arquivo.getAs(MimeType.PDF)],
      name: 'Indicadores RedeFlex'
    });
    arquivo.moveTo(pastaEnviados);
    return { nivel: info.nivel, nome: info.nome, email: email, status: 'Enviado' };
  } catch (e) {
    arquivo.moveTo(pastaRevisar);
    return { nivel: info.nivel, nome: info.nome, email: email, status: 'Falhou', detalhe: String(e) };
  }
}

/* Extrai data / DDD / nível / nome do padrão dd.mm.aa.Dir <DDD>[.Ger|.Sup|.Vend].<Nome> */
function analisarNomeArquivo(nome) {
  const m = nome.match(/^(\d{2}\.\d{2}\.\d{2})\.Dir (.+?)(?:\.(Ger|Sup|Vend)\.(.+))?$/);
  if (!m) return null;
  const abrevs = { Ger: 'Gerente', Sup: 'Supervisor', Vend: 'Vendedor' };
  const nivel = m[3] ? abrevs[m[3]] : 'Diretoria';
  const nomePessoa = m[3] ? m[4] : m[2];
  return { dataStr: m[1], ddd: m[2], nivel: nivel, nome: nomePessoa };
}

function mesAnoPorDataArquivo(dataStr) {
  const partes = dataStr.split('.').map(Number);
  const mm = partes[1], aa = partes[2];
  return MES_NOME[mm - 1] + '/20' + String(aa).padStart(2, '0');
}

/* Nível + Nome -> e-mail, lendo a aba "E-mails" (colunas: Nível | Nome | E-mail | Ativo). */
function carregarMapaEmails(planilha) {
  const aba = planilha.getSheetByName(ABA_EMAILS);
  const linhas = aba.getDataRange().getValues();
  const mapa = {};
  for (let i = 1; i < linhas.length; i++) {
    const nivel = linhas[i][0], nome = linhas[i][1], email = linhas[i][2], ativo = linhas[i][3];
    if (!nivel || !nome || !email) continue;
    if (String(ativo).trim().toUpperCase() === 'FALSE') continue;
    mapa[normalizar(nivel) + '|' + normalizar(nome)] = String(email).trim();
  }
  return mapa;
}

/* Remove acentos, espaços nas pontas e maiúsculas — pra casar "Supervisão BH"
   cadastrado na planilha com "supervisão bh" do nome do arquivo sem drama. */
function normalizar(s) {
  const marcasDiacriticas = new RegExp('[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']', 'g');
  return String(s).normalize('NFD').replace(marcasDiacriticas, '').trim().toLowerCase();
}

/* Rode esta função UMA VEZ, manualmente, pelo editor do Apps Script, pra criar
   o gatilho agendado. Se quiser outra frequência, ajuste antes de rodar (ex.:
   .everyDays(7).atHour(8) pra só às segundas, use ScriptApp.WeekDay.MONDAY
   com onWeekDay(...) — veja a documentação do ScriptApp.newTrigger). */
function criarGatilhoDiario() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'enviarRelatoriosPendentes') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('enviarRelatoriosPendentes')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
}
