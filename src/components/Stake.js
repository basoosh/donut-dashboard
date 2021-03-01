import React from 'react';
import DonutLogo from '../img/donut-logo.png';

class Stake extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          isMetamaskConnected: false,
          uniDonutBalance: 0,
      }

      this.formatNumber = this.formatNumber.bind(this);

      //mainnet
      const donutTokenAddress = "0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9";
      const uniDonutTokenAddress = "0x718Dd8B743ea19d71BDb4Cb48BB984b73a65cE06";
      const stakingContractAddress = "0x813fd5A7B6f6d792Bf9c03BBF02Ec3F08C9f98B2";
      //goerli
      /*const donutTokenAddress = "0x520e66be4b4308fe110808e99a7b22b90a94be1d";
      const uniDonutTokenAddress = "0x1945aa1ce911f437ff242e7a93e418ee7f8a3273";
      const stakingContractAddress = "0xF75CE1775435327238e4BE4FFdC6137a25B21F55";*/

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

      let provider, signer, currentAddress;
      let donutToken, uniDonutToken, stakingContract;
      let ethBalance, donutBalance, uniDonutBalance, totalStaked, stakedByUser, claimableByUser;
      let totalUniDonutSupply, donutsInUniswap;
      let isApproved = false;
      window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum)).then(init).then(run).then();       
    }

    async init() {
      signer = await provider.getSigner();
      donutToken = new ethers.Contract(donutTokenAddress, erc20Abi, provider);
      uniDonutToken = new ethers.Contract(uniDonutTokenAddress, uniTokenABi, signer);
      stakingContract = new ethers.Contract(stakingContractAddress, stakingContractAbi, signer);
      currentAddress = await signer.getAddress();
      document.getElementById("ethAddress").innerHTML = currentAddress;
      document.getElementById("metamaskStatus").style.display = "none";
    }
    
    async run() {
      await getBalances();
      await checkAllowance();
      if(isApproved && !uniDonutBalance.isZero()) {
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
    }
    
    async getBalances() {
      ethBalance = await signer.getBalance();
      document.getElementById("ethBalance").innerHTML = parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(2);
      donutBalance = await donutToken.balanceOf(currentAddress);
      document.getElementById("donutBalance").innerHTML = (donutBalance/1e18).toFixed(2);
      uniDonutBalance = await uniDonutToken.balanceOf(currentAddress);
      document.getElementById("uniDonutBalance").innerHTML = (uniDonutBalance/1e18).toFixed(2);
      document.getElementById("uniDonutBalance2").innerHTML = (uniDonutBalance/1e18).toFixed(2);
      totalStaked = await stakingContract.totalSupply();
      document.getElementById("totalStaked").innerHTML = (totalStaked/1e18).toFixed(2);
      stakedByUser = await stakingContract.balanceOf(currentAddress);
      document.getElementById("stakedByUser").innerHTML = (stakedByUser/1e18).toFixed(2);
      claimableByUser = await stakingContract.earned(currentAddress);
      document.getElementById("claimableByUser").innerHTML = (claimableByUser/1e18).toFixed(2);
      
      totalUniDonutSupply = await uniDonutToken.totalSupply();
      let [wethInUniswap, donutsInUniswap, _] = await uniDonutToken.getReserves();
      const stakedFraction = totalStaked/totalUniDonutSupply;
      const effectiveStakedDonuts = stakedFraction*donutsInUniswap*2/1e18;
      const rewardPerDayInDonuts = 24*60*60*(await stakingContract.rewardRate())/1e18;
      const dailyRoi = rewardPerDayInDonuts/effectiveStakedDonuts;
      const yearlyRoi = dailyRoi*365;
      
      document.getElementById("dailyRoi").innerHTML = (dailyRoi*100).toFixed(4);
      document.getElementById("yearlyRoi").innerHTML = (yearlyRoi*100).toFixed(4);
      const stakedByUserFraction = stakedByUser/totalUniDonutSupply;
      document.getElementById("donutLPStaked").innerHTML = (donutsInUniswap/1e18*stakedByUserFraction).toFixed(4);
      document.getElementById("ethLPStaked").innerHTML = (wethInUniswap/1e18*stakedByUserFraction).toFixed(4);
      document.getElementById("totalDonutLPStaked").innerHTML = (donutsInUniswap/1e18*stakedFraction).toFixed(4);
      document.getElementById("totalEthLPStaked").innerHTML = (wethInUniswap/1e18*stakedFraction).toFixed(4);
    }
    
    async checkAllowance() {
      if(isApproved) return;
      const allowance = await uniDonutToken.allowance(currentAddress, stakingContractAddress);
      //is approved?
      if(allowance.gte("0x7fffffffffffffffffffffffffffffff")) {
        document.getElementById("approveButton").style.display = "none";
        isApproved = true;
      }
    }
    
    async approveUniDonut() {
      let transactionResponse = await uniDonutToken.approve(stakingContractAddress, "0xffffffffffffffffffffffffffffffffffffffff");
      transactionResponse.wait(1).then(run);
    }
    
    async stake() {
      let transactionResponse = await stakingContract.stake(uniDonutBalance);
      transactionResponse.wait(1).then(run);
    }
    
    async withdraw() {
      let transactionResponse = await stakingContract.withdraw();
      transactionResponse.wait(1).then(run);
    }
    
    async claimDonuts() {
      let transactionResponse = await stakingContract.getReward();
      transactionResponse.wait(1).then(run);
    }
    
    async exit() {
      let transactionResponse = await stakingContract.exit();
      transactionResponse.wait(1).then(run);
    } 

    async componentDidMount() {
        let donutStats = await getDonutStats();

        this.setState({
        });
    }

    render() {
        return (
            <div className="content">
                <img src={DonutLogo} alt="Donut Logo" className="logo-image" />
                <span className="title-text"><u>Staking Donuts</u></span>
                <img src={DonutLogo} alt="Donut Logo" className="logo-image" />

                <p>Additional donuts are granted to those that provide donut liquidity on Uniswap.  100,000 donuts are 
                    distributed each week across UNI-V2 DONUT-ETH liquidity providers.</p>

                <p>To participate in donut staking, first receive UNI-V2 DONUT-ETH tokens by 
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