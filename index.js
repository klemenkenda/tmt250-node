class TMT250AVL {

    constructor(remote, port) {
        this.remote = remote;
        this.port = port;
        this.IMEI = "";
    }

    identify(buffer) {
        console.log(buffer);
    }

    decodeAVL(buffer) {

    }

}

module.exports = TMT250AVL;