const { crc16 } = require('crc');

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
        // extract records
        const pointer = this.extractRecords(buffer);
        // extract number of data 2
        this.packet.num_data_2 = buffer[pointer];

        // extract CRC16
        this.packet.crc16 = buffer.readUInt16BE(pointer + 3);
        // check CRC16
        this.packet.crc16real = crc16(buffer.slice(8, pointer + 1));

        console.log(this.packet);

        return new Buffer.from([1, 2, 3]);
    }

    extractRecords(buffer) {
        let remaining_data = this.packet.num_data;
        let pointer = 10; // current pointer
        this.packet.records = [];

        while (remaining_data > 0) {
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

            // extract I/O elements
            let event_io_id = buffer[pointer + 24];
            let number_of_events = buffer[pointer + 25];

            let n1 = buffer[pointer + 26];

            // parse n1 events
            let n1_events = [];
            pointer += 27;

            for (let i = 0; i < n1; i++) {
                const event_id = buffer[pointer];
                const value = buffer[pointer + 1];
                pointer += 2;
                n1_events.push({
                    event_id: event_id,
                    value: value
                })
            }

            // parse n2 events
            let n2 = buffer[pointer];
            pointer++;
            let n2_events = [];

            for (let i = 0; i < n2; i++) {
                const event_id = buffer[pointer];
                const value = buffer.readInt16BE(pointer + 1);
                pointer += 3;
                n2_events.push({
                    event_id: event_id,
                    value: value
                })
            }

            // parse n4 events
            let n4 = buffer[pointer];
            pointer++;
            let n4_events = [];

            for (let i = 0; i < n4; i++) {
                const event_id = buffer[pointer];
                const value = buffer.readInt32BE(pointer + 1);
                pointer += 5;
                n4_events.push({
                    event_id: event_id,
                    value: value
                })
            }

            // parse n4 events
            let n8 = buffer[pointer];
            pointer++;
            let n8_events = [];

            for (let i = 0; i < n8; i++) {
                const event_id = buffer[pointer];
                const value = buffer.readInt32BE(pointer + 1) * 2**32 + buffer.readInt32BE(pointer + 5);
                pointer += 9;
                n8_events.push({
                    event_id: event_id,
                    value: value
                })
            }

            console.log(n8_events);

            // add record
            this.packet.records.push({
                timestamp: timestamp,
                priority: priority,
                lon: lon,
                lat: lat,
                alt: alt,
                angle: angle,
                satellites: satellites,
                speed: speed,
                event_io_id: event_io_id,
                number_of_events: number_of_events,
                n1: n1,
                n1_events: n1_events,
                n2: n2,
                n2_events: n2_events,
                n4: n4,
                n4_events: n4_events,
                n8: n8,
                n8_events: n8_events
            })

            remaining_data--;
        }

        return pointer;
    }

}

module.exports = TMT250AVL;