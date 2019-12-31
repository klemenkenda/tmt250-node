const AVLDecoder = require('../index');
const assert = require('assert');

describe('AVL decoder', () => {

    let decoder;

    before(() => {
        decoder = new AVLDecoder('remote', 9999);
    });

    it('initialization', () => {
        assert.equal(decoder.remote, 'remote');
        assert.equal(decoder.port, 9999);
    });

    it('identify', () => {
        let data = 'AA8zNTk2MzIxMDkzMTcxNTM=';
        let buff = new Buffer.from(data, 'base64');
        decoder.identify(buff);
        assert.equal(decoder.IMEI, '359632109317153');
    });

    it('AVL decoding - CRC', () => {
        let data = 'AAAAAAAABPQIFwAAAW9WaEpoAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAAAAAAAAAFvVmhGgAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQAAAAAAAABb1ZoQpgACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAAAAAAAAAW9WaD6wAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAAJAAAAAAFvVmg6yAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQAqwAAAAABb1ZoNuAACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EASEAAAAAAW9WaDL4AAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAFCAAAAAAFvVmgvEAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQAngAAAAABb1ZoKygACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAWsAAAAAAW9WaCdAAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAEWAAAAAAFvVmgjWAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQBTwAAAAABb1ZoH3AACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAbYAAAAAAW9WaBuIAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RADlAAAAAAFvVmgXoAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQAAAAAAAABb1ZoE7gACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAAAAAAAAAW9WaA/QAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAAAAAAAAAFvVmgL6AAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQAAAAAAAABb1ZoCAAACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAAUAAAAAAW9WaAQYAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RACIAAAAAAFvVmgAMAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQBRwAAAAABb1Zn/EgACKRNixt5q5gAAAAAAAAAAAoF8AFQARUCyABFAgW1AAC2AAAYAABDED1EAUgAAAAAAW9WZ/hgAAikTYsbeauYAAAAAAAAAAAKBfABUAEVAsgARQIFtQAAtgAAGAAAQxA9RAE/AAAAAAFvVmf0eAAIpE2LG3mrmAAAAAAAAAAACgXwAVABFQLIAEUCBbUAALYAABgAAEMQPUQBMwAAFwAAnCc=';
        let buff = new Buffer.from(data, 'base64');
        let element = decoder.decodeAVL(buff);
        assert.equal(element.crc16, 39975);
    });

    it('AVL decoding - number of records', () => {
        let element = decoder.packet;
        assert.equal(element.num_data, 23);
        assert.equal(element.num_data_2, 23);
        assert.equal(element.records.length, 23);
    });

    it('AVL decoding - coordinates', () => {
        let element = decoder.packet;
        assert.equal(element.records[0].lon, 14.4985483);
        assert.equal(element.records[0].lat, 46.0958616);
    });

    it('AVL decoding - timestamp', () => {
        let element = decoder.packet;
        assert.equal(element.records[0].timestamp, 1577702673000);
    });

    it ('AVL response', () => {
        let buff = decoder.generateAVLResponse();
        assert.equal(buff.readInt32BE(0), 23);
    })

});