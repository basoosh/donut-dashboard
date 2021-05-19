import React from 'react';
import { ethers } from 'ethers';
import SteakLogo from '../img/donut-steak.png';

class Stake extends React.Component {

    constructor(props) {
      super(props);

      const erc20Abi = [
        // Read-Only Functions
        "function totalSupply() public view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function allowance(address owner, address spender) view returns (uint)",
        // Authenticated Functions
        "function transfer(address to, uint amount) returns (boolean)",
        "function approve(address _spender, uint256 _amount) returns (bool success)",
        // Events
        "event Transfer(address indexed from, address indexed to, uint amount)"];

      const uniTokenABi = erc20Abi.concat(
      ["function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)"]);

      const stakingContractAbi = [
        "function balanceOf(address account) public view returns (uint256)",
        "function totalSupply() public view returns (uint256)",
        "function rewardRate() public view returns (uint256)",
        "function lastTimeRewardApplicable() public view returns (uint64)",
        "function rewardPerToken() public view returns (uint128)",
        "function earned(address account) view returns (uint128)",
        "function stake(uint128 amount)",
        "function withdraw()",
        "function exit()",
        "function getReward()"];

      this.state = {
          isMetamaskConnected: false,
          xdaiDonutBalance: 0,

          provider: "",
          signer: "",
          currentAddress: "",

          donutToken: "",
          uniDonutToken: "",
          stakingContract: "",

          ethBalance: "",
          donutBalance: "",
          uniDonutBalance: "",
          totalStaked: "",
          stakedByUser: "",
          claimableByUser: "",
          
          totalUniDonutSupply: "",
          donutsInUniswap: "",

          isApproved: false,
          //Xdai Addresses
          donutTokenAddress: "0x524B969793a64a602342d89BC2789D43a016B13A",
          uniDonutTokenAddress: "0x077240a400b1740C8cD6f73DEa37DA1F703D8c00",
          stakingContractAddress: "0x84b427415A23bFB57Eb94a0dB6a818EB63E2429D",
      }

      this.run = this.run.bind(this);
      this.getBalances = this.getBalances.bind(this);
      this.checkAllowance = this.checkAllowance.bind(this);
      this.approveUniDonut = this.approveUniDonut.bind(this);
      this.stake = this.stake.bind(this);
      this.withdraw = this.withdraw.bind(this);
      this.claimDonuts = this.claimDonuts.bind(this);
      this.exit = this.exit.bind(this);

      //window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum)).then(init).then(run).then();       
    }
    
    async run() {
      await this.getBalances();
      await this.checkAllowance();
      /*
      if(this.isApproved && !this.uniDonutBalance.isZero()) {
        document.getElementById("stake").style.display = "block";
      }
      if(!stakedByUser.isZero()) {
        document.getElementById("userIsStaking").style.display = "block";
        document.getElementById("userIsStaking2").style.display = "inline";
      }
      if(!claimableByUser.isZero()) {
        document.getElementById("userHasClaimable").style.display = "block";
      }
      document.getElementById("app").style.display = "block";
      */
    }
    
    async getBalances() {
      this.xdaiBalance = await this.signer.getBalance();
      //document.getElementById("xdaiBalance").innerHTML = parseFloat(ethers.utils.formatEther(xdaiBalance)).toFixed(2);
      this.donutBalance = await this.donutToken.balanceOf(this.currentAddress);
      //document.getElementById("donutBalance").innerHTML = (donutBalance/1e18).toFixed(2);
      this.uniDonutBalance = await this.uniDonutToken.balanceOf(this.currentAddress);
      //document.getElementById("uniDonutBalance").innerHTML = (uniDonutBalance/1e18).toFixed(2);
      //document.getElementById("uniDonutBalance2").innerHTML = (uniDonutBalance/1e18).toFixed(2);
      this.totalStaked = await this.stakingContract.totalSupply();
      //document.getElementById("totalStaked").innerHTML = (totalStaked/1e18).toFixed(2);
      this.stakedByUser = await this.stakingContract.balanceOf(this.currentAddress);
      //document.getElementById("stakedByUser").innerHTML = (stakedByUser/1e18).toFixed(2);
      this.claimableByUser = await this.stakingContract.earned(this.currentAddress);
      //document.getElementById("claimableByUser").innerHTML = (claimableByUser/1e18).toFixed(2);
      
      this.totalUniDonutSupply = await this.uniDonutToken.totalSupply();
      /*
      let [wethInUniswap, donutsInUniswap, _] = await uniDonutToken.getReserves();
      const stakedFraction = this.totalStaked/this.totalUniDonutSupply;
      const effectiveStakedDonuts = stakedFraction*this.donutsInUniswap*2/1e18;
      const rewardPerDayInDonuts = 24*60*60*(await this.stakingContract.rewardRate())/1e18;
      const dailyRoi = rewardPerDayInDonuts/effectiveStakedDonuts;
      const yearlyRoi = dailyRoi*365;
      
      document.getElementById("dailyRoi").innerHTML = (dailyRoi*100).toFixed(4);
      document.getElementById("yearlyRoi").innerHTML = (yearlyRoi*100).toFixed(4);
      const stakedByUserFraction = this.stakedByUser/this.totalUniDonutSupply;
      document.getElementById("donutLPStaked").innerHTML = (donutsInUniswap/1e18*stakedByUserFraction).toFixed(4);
      document.getElementById("ethLPStaked").innerHTML = (wethInUniswap/1e18*stakedByUserFraction).toFixed(4);
      document.getElementById("totalDonutLPStaked").innerHTML = (donutsInUniswap/1e18*stakedFraction).toFixed(4);
      document.getElementById("totalEthLPStaked").innerHTML = (wethInUniswap/1e18*stakedFraction).toFixed(4);
      */
    }
    
    async checkAllowance() {
      if(this.isApproved) return;
      const allowance = await this.uniDonutToken.allowance(this.currentAddress, this.stakingContractAddress);
      //is approved?
      if(allowance.gte("0x7fffffffffffffffffffffffffffffff")) {
        //document.getElementById("approveButton").style.display = "none";
        this.isApproved = true;
      }
    }
    
    async approveUniDonut() {
      let transactionResponse = await this.uniDonutToken.approve(this.stakingContractAddress, "0xffffffffffffffffffffffffffffffffffffffff");
      transactionResponse.wait(1).then(this.run);
    }
    
    async stake() {
      let transactionResponse = await this.stakingContract.stake(this.uniDonutBalance);
      transactionResponse.wait(1).then(this.run);
    }
    
    async withdraw() {
      let transactionResponse = await this.stakingContract.withdraw();
      transactionResponse.wait(1).then(this.run);
    }
    
    async claimDonuts() {
      let transactionResponse = await this.stakingContract.getReward();
      transactionResponse.wait(1).then(this.run);
    }
    
    async exit() {
      let transactionResponse = await this.stakingContract.exit();
      transactionResponse.wait(1).then(this.run);
    } 

    async componentDidMount() {
        let signer = await this.provider.getSigner();
        let donutToken = new ethers.Contract(this.donutTokenAddress, this.erc20Abi, this.provider);
        let uniDonutToken = new ethers.Contract(this.uniDonutTokenAddress, this.uniTokenABi, this.signer);
        let stakingContract = new ethers.Contract(this.stakingContractAddress, this.stakingContractAbi, this.signer);
        let currentAddress = await this.signer.getAddress();
        // document.getElementById("ethAddress").innerHTML = currentAddress;
        // document.getElementById("metamaskStatus").style.display = "none";
  
        this.setState({
          signer: signer,
          donutToken: donutToken,
          uniDonutToken: uniDonutToken,
          stakingContract: stakingContract,
          currentAddress: currentAddress
        });

        this.run();
        
    }

    render() {
        return (
            <div className="content">
                <img src={SteakLogo} alt="Donut Logo" className="logo-image" />
                <span className="title-text"><u>Staking Donuts</u></span>

                <p>Additional donuts are granted to those that provide donut liquidity on Honeyswap.  200,000 donuts are 
                    distributed each distribution period across DONUT-XDAI liquidity providers.</p>

                <p>To participate in donut staking, first receive Honeyswap DONUT-ETH tokens by 
                    <a target="_blank" rel="noreferrer" href="https://app.uniswap.org/#/add/ETH/0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9">contributing liquidity
                    on Uniswap</a> (you will need an equal amount of DONUTs and ETH, in terms of USD).  
                    Then, add your DONUT-ETH tokens to the staking contract below.</p>
                    
                <div className="content">
                  <div>
                    <button id="approveButton" onclick="approveUniDonut().then()">Approve Token Spending</button>
                  </div>

                  <div>
                    <button id="stakeButton" onclick="stake().then()">Stake Donuts</button>
                    <p>Current UNI-V2 DONUT-ETH tokens available for staking: {this.uniDonutBalance}</p>
                  </div>

                  <div>
                    You are currently staking <span id="stakedByUser">0</span> UNI-V2 DONUT-ETH (<span id="donutLPStaked">0</span> DONUTs, <span id="ethLPStaked">0</span> WETH). You can <button onclick="withdraw().then()">unstake</button>
                  </div>

                  <div>
                    <div id="userHasClaimable" style="display: none">You can <button onclick="claimDonuts().then()">claim</button> <span id="claimableByUser">0</span> DONUTs <span id="userIsStaking2" style="display: none">, or <button onclick="exit().then()">claim and unstake</button></span></div>
                  </div>

                  <div>There are <span id="totalStaked">0</span> total staked UNI-V2 DONUT-ETH (<span id="totalDonutLPStaked">0</span> DONUTs, <span id="totalEthLPStaked">0</span> ETH).</div>
                  <div>Daily return: <span id="dailyRoi">0</span>%</div>
                  <div>APY: <span id="yearlyRoi">0</span>%</div>
      
              </div>
            </div>
        );
    }


}

export default Stake;