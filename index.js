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
        this.packet.num_data = buffer[9];

        this.extractRecords(buffer);

        console.log(this.packet);

        return new Buffer.from([1, 2, 3]);
    }

    extractRecords(buffer) {
        let remaining_data = this.packet.num_data;
        let pointer = 10; // current pointer
        this.packet.records = [];

        while (remaining_data !== 0) {
            // extract timestamp
            let timestamp = buffer.readInt32BE(pointer) * 2**32 + buffer.readInt32BE(pointer + 4);
            // extract priority
            let priority = buffer[pointer + 8];
            // extract GPS element
            let lon = buffer.readInt32BE(pointer + 9) / 10**7;
            let lat = buffer.readInt32BE(pointer + 13) / 10**7;
            let alt = buffer.readInt16BE(pointer + 17);
            let angle = buffer.readInt16BE(pointer + 19);
            let satellites = buffer[pointer + 21];
            let speed = buffer.readInt16BE(pointer + 22);

            // add record
            this.packet.records.push({
                timestamp: timestamp,
                priority: priority,
                lon: lon,
                lat: lat,
                alt: alt,
                angle: angle,
                sattelites: satellites,
                speed: speed
            })

            remaining_data = 0;
        }

    }

}

module.exports = TMT250AVL;