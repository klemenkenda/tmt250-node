class TMT250AVL {

    constructor(remote, port) {
        this.remote = remote;
        this.port = port;
        this.IMEI = "";
        this.packet = {};
    }

    identify(buffer) {
        const length = buffer[0] * 256 + buffer[1];
        const IMEI = buffer.toString().substring(2);
        if (IMEI.length === length) {
            this.IMEI = IMEI;
            return true;
            this.packet = {};
        }
        return false;
    }

    decodeAVL(buffer) {
        // check zeroes
        this.packet.zeroes = buffer.readInt32BE(0);
        // extract length
        this.packet.length = buffer.readInt32BE(4);
        // extract codec ID
        this.packet.codecID = buffer[8]
        // extract number of data 1
        this.packet.num_data_1 = buffer[9];

        console.log(this.packet);

        return new Buffer.from([1, 2, 3]);
    }

}

module.exports = TMT250AVL;