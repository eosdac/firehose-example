# eosDAC Firehose Example

This repository contains a very simple example showing usage of the `FirehoseClient` which connects to a compatible `FirehoseServer`.

The script will listen for all transfers on `eosio.token` as well as showing live state updates for accounts involved in those transfers.

## Building

Download this and the `firehose-client` into the same directory

`git clone https://github.com/eosdac/firehose-client.git`

`git clone https://github.com/eosdac/firehose-example.git`

`cd firehose-client`

`npm i`

`cd ../firehose-example`

`npm i`

Build the example

`npm run build`

## Running

Open index.html in your browser