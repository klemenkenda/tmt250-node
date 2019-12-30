class TMT250AVL {

    constructor(remote, port) {
        this.remote = remote;
        this.port = port;
        this.IMEI = "";
    }

    identify(buffer) {
        const length = buffer[0] * 256 + buffer[1];
        const IMEI = buffer.toString().substring(2);
        if (IMEI.length === length) {
            this.IMEI = IMEI;
            return true;
        }
        return false;
    }

    decodeAVL(buffer) {

    }

}

module.exports = TMT250AVL;