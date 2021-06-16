import React from 'react';
import { ethers } from 'ethers';
import Loading from '../img/loading.gif';
//import Title from '../img/title-track.png';
import DonutLogo from '../img/donut-logo.png';

class Track extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          isMetamaskConnected: false,

          provider: "",
          signer: "",
          currentAddress: "",
          network: 0,

          mainNetDonutTokenAddress: "0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9",
          xdaiDonutTokenAddress: "0x524B969793a64a602342d89BC2789D43a016B13A",

          isLoading: true
      }

      this.run = this.run.bind(this);      
      this.addDonutsMainNet = this.addDonutsMainNet.bind(this);
      this.addDonutsXDai = this.addDonutsXDai.bind(this);

      //window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum)).then(init).then(run).then();    
    }
    
    async run() {

      this.setState({
        isLoading: false
      });
    }
    
    async addDonutsMainNet() {
      let transactionResponse = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', 
          options: {
            address: this.state.mainNetDonutTokenAddress, 
            symbol: "DONUT", 
            decimals: 18, 
            image: "https://donut-dashboard.com/static/media/donut-logo.b4501f7a.png", 
          },
        },
      });
    }

    async addDonutsXDai() {
        let transactionResponse = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', 
              options: {
                address: this.state.xdaiDonutTokenAddress, 
                symbol: "DONUT", 
                decimals: 18, 
                image: "https://donut-dashboard.com/static/media/donut-logo.b4501f7a.png", 
              },
            },
          });
      }

    async componentDidMount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (typeof window.ethereum !== 'undefined') {       
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = await provider.getSigner();

        let network = await provider.getNetwork();

        this.setState({
            provider: provider,
            signer: signer,
            network: network.chainId
        });
        this.run();
      }
    }

    render() {

        let render = 
              <div className="content">          
                  <table className="harvest-table">
                  <tbody>
                    <tr>
                    <th>{ this.state.network===1 ? <div className="content-center"><button className="btn-main-net" id="mainNetButton" onClick={this.addDonutsMainNet}>Track Donuts in Metamask<br />(Ethereum Main Net)</button></div> 
                        : <div className="content-center"><button className="btn-disable" id="mainNetButton">Track Donuts in Metamask<br />(Ethereum Main Net)</button></div> } </th>
                    <th>{ this.state.network===100 ? <div className="content-center"><button className="btn-xdai" id="xdaiButton" onClick={this.addDonutsXDai}>Track Donuts in Metamask<br />(XDai)</button></div> 
                    :  <div className="content-center"><button className="btn-disable" id="xdaiButton">Track Donuts in Metamask<br />(XDai)</button></div>}</th>
                    </tr>
                  </tbody>
                  </table>
                </div>;

        //<img src={Title} alt="Fresh Donuts" className="logo-image" /><br /><br />

        return (
            <div className="content">
                
            
                <p className="left-body">Want to track donuts in your Metamask wallet?  First, connect your Metamask account to this site and the network of your choice.  Then click the below buttons:</p>    
                
                { this.state.isLoading ? <img src={Loading} /> : render }

            </div>
        );
    }


}

export default Track;