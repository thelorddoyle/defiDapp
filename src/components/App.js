import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async UNSAFE_componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    
    if (typeof window.ethereum !== 'undefined') {

      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      // loading balance
      if (typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({
          account: accounts[0],
          balance,
          web3
        })
        console.log(balance/1000000000000000000)
      } else {
        window.alert('Please install MetaMask.')
      } // finished loading balance

      try {
        // token
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
        // bank
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
        const dBankAddress = dBank.networks[netId].address;
        this.setState({token, dbank, dBankAddress});
      } catch(e) {
        console.log('Error: ', e);
        window.alert('Contracts not deployed to the current network.')
      }

    } else {
      window.alert('Please install MetaMask.')
    };

    //check if MetaMask exists


      //assign to values to variables: web3, netId, accounts

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    if (this.state.dbank !== 'undefined') {
      try {
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account});
      } catch (e) {
        console.log('Error, deposit: ', e)
      }

    }
  }

  async withdraw(e) {
    e.preventDefault();
    if (this.state.dbank !== 'undefined') {
      try {
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch (e) {
        console.log('Error, withdrawal: ', e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <h2 style={{color: 'white'}}>TLB</h2>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to The Lord's Bank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey='deposit' title='Deposit'>
                  <div>
                    <br />
                    How much do you want to deposit?
                    <br />
                    (Minimum amount is 0.01 ETH)
                    <br />
                    (Only a single deposit is possible at this time)
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      let amount = Number(this.depositAmount.value);
                      amount = amount * (10**18) // convert to wei
                      this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br />
                        <input 
                          id='depositAmount'
                          step='0.01'
                          type='number'
                          className='form-control form-control-md'
                          placeholder='Amount To Deposit'
                          required
                          ref={(input) => {this.depositAmount = input}}
                        />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>
                  </div>
                </Tab>              
                <Tab eventKey='withdraw' title='Withdraw'>
                    <br />
                    <br />
                    Do you want to withdraw your stake and your earned interest?
                    <br />
                    <br />
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>

                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;