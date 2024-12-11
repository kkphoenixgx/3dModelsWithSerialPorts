const { SerialPortStream } = require('@serialport/stream');
const { MockBinding } = require('@serialport/binding-mock');
const { ReadlineParser } = require('@serialport/parser-readline');
const yargs = require('yargs');

// Configura os argumentos da linha de comando
const argv = yargs
    .option('path', {
        alias: 'p',
        description: 'Caminho para a porta serial simulada',
        type: 'string',
        default: '/dev/tty-arduino-sim',
    })
    .option('rate', {
        alias: 'r',
        description: 'Taxa de baud (baudRate)',
        type: 'number',
        default: 9600,
    })
    .help()
    .alias('help', 'h')
    .argv;

// Configura o mock
MockBinding.createPort(argv.path, { echo: true, record: true });

function createSerialPort(path, rate) {
    const port = new SerialPortStream({
        binding: MockBinding, // Usando o MockBinding
        path,
        baudRate: rate,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
    addEvents(port, parser);

    console.log("Porta serial simulada criada em:", path, "com baudRate:", rate);
    return port;
}

// Configura os eventos da porta
function addEvents(port, parser) {
    port.on('open', () => {
        console.log(`Conectado à porta simulada: ${port.path}`);
        setTimeout(() => {
            port.write('PING\n'); // Envia um comando simulado
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