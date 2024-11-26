const { SerialPort, ReadlineParser } = require('serialport');
const yargs = require('yargs');

// Configura os argumentos da linha de comando
const argv = yargs
    .option('path', {
        alias: 'p',
        description: 'Caminho para a porta serial',
        type: 'string',
        demandOption: true,
    })
    .option('rate', {
        alias: 'r',
        description: 'Taxa de baud (baudRate)',
        type: 'number',
        demandOption: true,
    })
    .help()
    .alias('help', 'h')
    .argv;

// Função para criar a porta serial
function createSerialPort(path, rate) {
    const port = new SerialPort({
        path: path,
        baudRate: rate,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    addEvents(port, parser);

    console.log("Porta serial criada em:", path, "com baudRate:", rate);
    return port;
}

// Configura os eventos da porta
function addEvents(port, parser) {
    port.on('open', () => {
        console.log(`Conectado à porta: ${port.path}`);

        // Envia um comando ao dispositivo/simulador
        setTimeout(() => {
            port.write('PING\n');
        }, 1000);
    });

    // Lê os dados recebidos
    parser.on('data', (data) => {
        console.log(`Resposta da porta ${port.path}:`, data.trim());
    });

    // Tratamento de erros
    port.on('error', (err) => {
        console.error(`Erro na porta ${port.path}:`, err.message);
    });
}

// Executa o microserviço com as flags fornecidas
createSerialPort(argv.path, argv.rate);
