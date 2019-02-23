const FirehoseClient = require('../../firehose-client')

const config = require('../config')

/*
 * Example showing real time balance updates
 */


/*
Function to render the table of balances
 */
global.balances = {}
let block_num = 0
function render_table(){
    let table = document.getElementById('results_table')
    table.innerHTML = ''
    const max_rows = 25

    let rows_rendered = 0
    for (let act in global.balances){
        if (rows_rendered == max_rows){
            break
        }

        const existing_row = document.getElementById('result_row_' + act)
        if (existing_row){
            existing_row.getElementsByTagName('td').item(1).innerHTML = global.balances[act]
        }
        else {
            const tr = document.createElement('tr')
            tr.setAttribute('id', 'result_row_' + act)

            const td_act = document.createElement('td')
            td_act.innerHTML = act
            const td_bal = document.createElement('td')
            td_bal.setAttribute('style', 'text-align:right')
            td_bal.innerHTML = global.balances[act]

            tr.appendChild(td_act)
            tr.appendChild(td_bal)

            table.insertBefore(tr, table.getElementsByTagName('tr').item(1))
        }

        rows_rendered++
    }

    global.balances = {}
}


/*
Configure the client with the location of the websocket endpoint and eos api server
 */
const firehose = new FirehoseClient(config)
firehose
    .ready((firehose) => {
        /* Once the firehose client is ready, we request the items we need, request returns the firehose object
           so they can be chained */
        firehose
            /* all action traces for eosio.token transfer */
            .request('action_trace', {code:'eosio.token', name:'transfer'})
            .request('action_trace', {code:'eosdactokens', name:'transfer'})
            /* all contract row changes for eosio.token accounts (add 'scope' to filter by scope) */
            .request('contract_row',{code: 'eosio.token', table: 'accounts'})
            // .request('contract_row',{code: 'eosdactokens', table: 'accounts'})
    })
    /* Callback for all responses */
    .callback((type, data) => {
        // console.log(data)
        document.getElementById('block_num').innerHTML = data.block_num
        if (type === 'contract_row'){
            global.balances[data.scope] = data.data.balance
        }
        else if (type === 'action_trace'){
            document.getElementById('actions').innerHTML = `${data.account}:${data.name} ${data.data.from} -> ${data.data.to} ${data.data.quantity}`
        }
    })

/* Render the items in a table */
window.setInterval(render_table, 2000)
