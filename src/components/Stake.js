import React from 'react';
import { ethers } from 'ethers';
import SteakLogo from '../img/donut-steak.png';
import Loading from '../img/loading.gif';
import Title from '../img/title-stake.png';

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

      const uniTokenAbi = erc20Abi.concat(
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

          xdaiBalance: "",
          donutBalance: "",
          uniDonutBalance: "",
          uniDonutBalanceBigNum: "",
          totalStaked: "",
          stakedByUser: "",
          claimableByUser: "",
          
          totalUniDonutSupply: "",
          donutsInUniswap: "",

          dailyRoi: 0,
          yearlyRoi: 0,
          estimatedDailyDonuts: 0,

          isApproved: false,
          //Xdai Addresses
          donutTokenAddress: "0x524B969793a64a602342d89BC2789D43a016B13A",
          uniDonutTokenAddress: "0x077240a400b1740C8cD6f73DEa37DA1F703D8c00",
          stakingContractAddress: "0x84b427415A23bFB57Eb94a0dB6a818EB63E2429D",

          uniTokenAbi: uniTokenAbi,
          stakingContractAbi: stakingContractAbi,
          erc20Abi: erc20Abi,
           
          donutTokenContract: "",
          uniDonutTokenContract: "",
          stakingContract: "",

          userXdaiStaked: 0,
          userDonutStaked: 0,

          stakedFraction: 0,
          stakedByUserFraction: 0,
          heldByUserFraction: 0,

          totalXdaiStaked: 0,
          totalDonutStaked: 0,

          isLoading: true
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

      this.getBalances();

      this.setState({
        isLoading: false
      });
      
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
      let xdaiBalance = await this.state.signer.getBalance();
      xdaiBalance = parseFloat(ethers.utils.formatEther(xdaiBalance)).toFixed(2);

      let donutBalance = await this.state.donutTokenContract.balanceOf(this.state.currentAddress);
      donutBalance = (donutBalance/1e18).toFixed(2);

      let uniDonutBalance = await this.state.uniDonutTokenContract.balanceOf(this.state.currentAddress);
      let uniDonutBalanceBigNum = uniDonutBalance;
      uniDonutBalance = (uniDonutBalance/1e18).toFixed(2);

      let totalStaked = await this.state.stakingContract.totalSupply();
      totalStaked = (totalStaked/1e18).toFixed(3);

      let stakedByUser = await this.state.stakingContract.balanceOf(this.state.currentAddress);
      stakedByUser = (stakedByUser/1e18).toFixed(3);

      let claimableByUser = await this.state.stakingContract.earned(this.state.currentAddress);
      claimableByUser = (claimableByUser/1e18).toFixed(3);

      let totalUniDonutSupply = await this.state.uniDonutTokenContract.totalSupply();
      totalUniDonutSupply = (totalUniDonutSupply/1e18).toFixed(3);
      
      let [donutsInUniswap, wxdaiInUniswap, _] = await this.state.uniDonutTokenContract.getReserves();
      let stakedFraction = totalStaked/totalUniDonutSupply;

      wxdaiInUniswap = (wxdaiInUniswap/1e18).toFixed(0);
      donutsInUniswap = (donutsInUniswap/1e18).toFixed(0);
      
      const effectiveStakedDonuts = stakedFraction*donutsInUniswap*2;

      const rewardPerDayInDonuts = 24*60*60*(await this.state.stakingContract.rewardRate())/1e18;
      let dailyRoi = rewardPerDayInDonuts/effectiveStakedDonuts;
      let yearlyRoi = dailyRoi*365;

      dailyRoi = (dailyRoi*100).toFixed(3);
      yearlyRoi = (yearlyRoi*100).toFixed(3);

      let stakedByUserFraction = stakedByUser/totalStaked;
      let heldByUserFraction = stakedByUser/totalUniDonutSupply;
      const estimatedDailyDonuts = (stakedByUserFraction*rewardPerDayInDonuts).toFixed(3);

      let userDonutStaked = (donutsInUniswap*stakedByUserFraction).toFixed(0);
      let userXdaiStaked = (wxdaiInUniswap*stakedByUserFraction).toFixed(2);

      let totalDonutStaked = (donutsInUniswap*stakedFraction).toFixed(0);
      let totalXdaiStaked = (wxdaiInUniswap*stakedFraction).toFixed(2);

      stakedFraction = (stakedFraction*100).toFixed(3);
      stakedByUserFraction = (stakedByUserFraction*100).toFixed(3);
      heldByUserFraction = (heldByUserFraction*100).toFixed(3);

      this.setState({
        xdaiBalance: xdaiBalance,
        donutBalance: donutBalance,
        uniDonutBalance: uniDonutBalance,
        uniDonutBalanceBigNum: uniDonutBalanceBigNum,
        totalStaked: totalStaked,
        stakedByUser: stakedByUser,
        claimableByUser: claimableByUser,
        totalUniDonutSupply: totalUniDonutSupply,
        dailyRoi: dailyRoi,
        yearlyRoi: yearlyRoi,
        estimatedDailyDonuts: estimatedDailyDonuts,
        userDonutStaked: userDonutStaked,
        userXdaiStaked: userXdaiStaked,
        stakedFraction: stakedFraction,
        stakedByUserFraction: stakedByUserFraction,
        heldByUserFraction: heldByUserFraction,
        totalXdaiStaked: totalXdaiStaked,
        totalDonutStaked: totalDonutStaked,
        isLoading: false
      });
    }
    
    async checkAllowance() {
      if(this.state.isApproved) return;
      const allowance = await this.state.uniDonutTokenContract.allowance(this.state.currentAddress, this.state.stakingContractAddress);
      //is approved?
      if(allowance.gte("0x7fffffffffffffffffffffffffffffff")) {
        this.setState({
          isApproved: true
        });
      }
    }
    
    async approveUniDonut() {
      let transactionResponse = await this.state.uniDonutTokenContract.approve(this.state.stakingContractAddress, "0xffffffffffffffffffffffffffffffffffffffff");
      transactionResponse.wait(1).then(this.run);
    }
    
    async stake() {
      let transactionResponse = await this.state.stakingContract.stake(this.state.uniDonutBalanceBigNum);
      this.setState({
        isLoading: true
      });
      transactionResponse.wait(1).then(this.run);
    }
    
    async withdraw() {
      let transactionResponse = await this.state.stakingContract.withdraw();
      this.setState({
        isLoading: true
      });
      transactionResponse.wait(1).then(this.run);
    }
    
    async claimDonuts() {
      let transactionResponse = await this.state.stakingContract.getReward();
      this.setState({
        isLoading: true
      });
      transactionResponse.wait(1).then(this.run);
    }
    
    async exit() {
      let transactionResponse = await this.state.stakingContract.exit();
      this.setState({
        isLoading: true
      });
      transactionResponse.wait(1).then(this.run);
    } 

    async componentDidMount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (typeof window.ethereum !== 'undefined') {
        
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = await provider.getSigner();
        let currentAddress = await signer.getAddress();

        let donutTokenContract = new ethers.Contract(this.state.donutTokenAddress, this.state.erc20Abi, signer);
        let uniDonutTokenContract = new ethers.Contract(this.state.uniDonutTokenAddress, this.state.uniTokenAbi, signer);
        let stakingContract = new ethers.Contract(this.state.stakingContractAddress, this.state.stakingContractAbi, signer);
        
        this.setState({
          signer: signer,
          provider: provider,
          donutTokenContract: donutTokenContract,
          uniDonutTokenContract: uniDonutTokenContract,
          stakingContract: stakingContract,
          currentAddress: currentAddress
        });

        try {
          await this.getBalances();
          await this.checkAllowance();
        } catch (err) {
          console.log("Error: ", err)
        }
      }

        this.run();
    }

    render() {

        let render = 
              <div className="content">          
                  <div className="content-center">
                    { this.state.isApproved ? <p></p> : 
                    <button className="btn-active" id="approveButton" onClick={this.approveUniDonut}>Approve LP Token Spending</button>}
                  </div>
                  <div className="content-center">
                    { this.state.isApproved && this.state.uniDonutBalance > 0 ? <button className="btn-active" id="stakeButton" onClick={this.stake}>Stake LP Tokens</button>
                    : <p></p> }
                  </div>

                  { this.state.isApproved ? 
                  <table className="harvest-table">
                  <tbody>
                    <tr>
                    <th>{ this.state.isApproved && this.state.claimableByUser > 0 ? <div><span className="stake-header">READY TO HARVEST</span><br /> <span className="harvest-number">{this.state.claimableByUser}</span>DONUTS</div> : <span></span>}</th>
                    <th>{ this.state.isApproved && this.state.claimableByUser > 0 ? <div className="content-center"><button className="btn-harvest" id="harvestButton" onClick={this.claimDonuts}>Harvest Donuts</button></div> : <span></span> }</th>
                    <th>{ this.state.stakedByUser > 0 && this.state.claimableByUser == 0 ? <p>You are currently staking, but don't have any donuts to harvest yet.  Return to this page later!</p> : <span></span> }</th>
                    <th>{ this.state.isApproved && this.state.stakedByUser > 0 ? <div className="content-center"><button className="btn-withdraw" id="withdrawButton" onClick={this.withdraw}>Withdraw Staked LP Tokens</button></div> : <span></span> }</th>
                    </tr>
                  </tbody>
                  </table>
                  : <p></p>
                  }

                  <br /><br />

                  <table className="staking-table">
                  <thead>
                    <tr>
                    <th>
                      <span className="stake-header">24HR RETURN</span><br />
                      <span className="rate-number">{this.state.dailyRoi}%</span>
                    </th>
                    <th>
                      <span className="stake-header">ANNUAL RETURN</span><br />
                      <span className="rate-number">{this.state.yearlyRoi}%</span>
                    </th>
                    </tr>
                  </thead>
                  </table>

                  <br /><br />

                  <table className="staking-table">
                  <thead>
                    <tr>
                    <th>
                      <span className="stake-header">% OF LIQUIDITY STAKED</span><br />
                      <span className="rate-number">{this.state.stakedFraction}%</span>
                    </th>
                    <th>
                      <span className="stake-header">TOTAL STAKING DEPOSITS</span><br />
                      <span className="staking-number">{this.state.totalStaked}</span> DONUT-XDAI LP<br />
                      (<span className="staking-number">{this.state.totalDonutStaked}</span> DONUT<br />
                      <span className="staking-number">{this.state.totalXdaiStaked}</span> XDAI)
                    </th>
                    </tr>
                  </thead>
                  </table>

                  <br /><br />

                  { this.state.isApproved && this.state.stakedByUser > 0 ?
                  <table className="rate-table">
                  <thead>
                    <tr>
                    <span className="stake-your-info-header">YOUR ESTIMATED DONUTS/DAY</span><br />
                    <span className="rate-number">{this.state.estimatedDailyDonuts}</span>
                    </tr>
                  </thead>
                  </table> : <p></p>  
                  }

                  { this.state.isApproved && this.state.stakedByUser > 0 ? <div><br /><br /></div> : <p></p> }

                  { this.state.isApproved && this.state.stakedByUser > 0 ?
                  <table className="rate-table">
                  <thead>
                    <tr>
                    <th className="three-col">
                      <span className="stake-your-info-header">YOUR STAKING DEPOSITS</span><br />
                      <span className="staking-number">{this.state.stakedByUser}</span> DONUT-XDAI LP<br />
                      (<span className="staking-number">{this.state.userDonutStaked}</span> DONUT<br />
                      <span className="staking-number">{this.state.userXdaiStaked}</span> XDAI)
                    </th>
                    <th className="three-col">
                      <span className="stake-your-info-header">YOUR % OWNERSHIP OF LIQUIDITY POOL</span><br />
                      <span className="rate-number">{this.state.heldByUserFraction}%</span>
                    </th>
                    <th className="three-col">
                      <span className="stake-your-info-header">YOUR % OWNERSHIP OF STAKED DONUTS</span><br />
                      <span className="rate-number">{this.state.stakedByUserFraction}%</span>
                    </th>
                    </tr>
                  </thead>
                  </table> : <p></p>
                  }

                  <br />

                  <p><i>* All rates listed above are not fixed and will change in real-time as market conditions change.</i></p>
                </div>;

        return (
            <div className="content">
                <img src={Title} alt="Fresh Donuts" className="logo-image" /><br /><br />
                <img src={SteakLogo} alt="Steak Logo" className="logo-image-medium" />

                <p className="left-body">Additional donuts are granted to those that provide donut liquidity via Honeyswap on the XDai sidechain.  
                    200,000 donuts are earned each 28-day period, distributed across DONUT-XDAI liquidity providers in real-time.</p>

                <p className="left-body">To participate in donut staking, first receive Honeyswap DONUT-XDAI tokens by <a target="_blank" rel="noreferrer" href="https://app.honeyswap.org/#/pool">contributing liquidity
                    on Honeyswap</a> (you will need an equal value amount of DONUTs and XDAI, in terms of USD).  Once you provide liquidity, Honeyswap
                    will credit your account with DONUT-XDAI tokens.  Add your DONUT-XDAI tokens to the staking contract using the interface 
                    below.</p>
                    
                
                { this.state.isLoading ? <img src={Loading} /> : render }
                  
            </div>
        );
    }


}

export default Stake;