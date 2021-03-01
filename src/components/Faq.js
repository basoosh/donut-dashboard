import React from 'react';
import Title from '../img/title-faq.png';


class Faq extends React.Component {

    render() {
        return (
            <div className="content">
                <img src={Title} alt="Frequently Asked Questions" className="logo-image" />
                
                <div className="faq-odd">
                    <p className="faq-q">Q: What are donuts?</p>

                    <p className="faq-a">A: Donuts are tokens running on the Ethereum main-net that represent community contribution & engagement here at r/ethtrader. Donuts follow the ERC-20 standard and are the first ever implementation of Reddit Community Points. An easy way to think of them is a spendable and tradeable Karma, but exclusive to this subreddit.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: What are donuts used for?</p>

                    <p className="faq-a">A: Donuts can be used for additional vote weight in community polls, tipping other users, purchasing special memberships, posting GIFs in comments, obtaining special-colored names, purchasing badges, and even purchasing the top banner (which can be used for advertising).  Donuts spent in these ways are burned, meaning they are destroyed and leave circulation.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: How do I register for donuts?</p>

                    <p className="faq-a">A: See instructions on <a href="/register">this page</a>.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: How often are new donuts minted?</p>

                    <p className="faq-a">A: A fresh batch of donuts is baked every 4 weeks.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: How many new donuts are minted in each batch?</p>

                    <p className="faq-a">A: 4 million donuts are created in each batch, with an additional 400,000 for liquidity incentives.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: How do I claim my donuts?</p>

                    <p className="faq-a">A: See instructions on <a href="/claim">this page</a>.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: Will I lose my donuts if I don't claim them right away?</p>

                    <p className="faq-a">A: Donuts can be claimed any time later on. Multiple batches can even be claimed as part of the same transaction. (this refers to decentralized donuts only, see below about centralized donuts from 2018/2019 which are now moldy)</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: I had donuts from 2018-2019, can I still claim them?</p>

                    <p className="faq-a">A: Unfortunately, no. In late 2019 & early 2020, donuts transitioned from being centralized on Reddit's servers to decentralized tokens on Ethereum. There was a period of a couple months where users needed to log in and claim their donuts - this was done by providing Reddit with an Ethereum address. Any donuts not claimed after those months were lost.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: Gas fees are extremely high.  How can I save money on retrieving my donuts?</p>

                    <p className="faq-a">A: /r/ethtrader is currently experimenting with distributing donuts on xDai.  Visit <a href="https://www.reddit.com/r/ethtrader/comments/ll8wwg/comment_to_receive_your_donut_distribution_on/" target="_blank" rel="noreferrer">this thread</a> to signal you would like to receive future donuts on xDai instead of main net.  Beyond that, you can batch multiple claims into a single transaction or wait for cheaper gas costs to come.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: Where can I buy and sell donuts?</p>

                    <p className="faq-a">A: Uniswap, Hoo.com, and Honeyswap all currently trade donuts.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: How many donuts are in circulation?</p>

                    <p className="faq-a">A: About 120 million at the time of writing. You can view up-to-date statistics on the <a href="https://etherscan.io/token/0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9" target="_blank" rel="noreferrer">etherscan donut page</a>.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: What is CONTRIB?</p>

                    <p className="faq-a">A: Whenever a user earns donuts, they earn an equal amount of CONTRIB. CONTRIB is a separate token and is non-transferrable. It essentially shows life-time earnings, even if a user has sold their donuts. It can also be used to potentially restrict some actions to users that earned their donuts, rather than purchased them.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: What are the costs to purchase the banner?</p>

                    <p className="faq-a">A: The cost to purchase the banner is a variable rate that uses a Harberger Tax. The owner of the banner sets a price point in donuts and pays a 10% daily rent to keep ownership. Any other user can purchase ownership of the banner by paying the buy-out cost. If the previous owner does not pay the daily tax, the cost to purchase the banner drops to zero.</p>
                    <p className="faq-a">As an example, Alice buys the banner. She sets the price at 10,000 donuts. This means she must pay 1,000 donuts per day to maintain ownership of the banner. At any time, Bob can take ownership of the banner by paying Alice's buy-out price of 10,000 donuts. If he does, he then chooses the next buy-out price and, by extension, his daily rent amount.</p>
                </div>
                <div className="faq-even">
                    <p className="faq-q">Q: How long have donuts been around?</p>

                    <p className="faq-a">A: Since 2018, though they weren't ERC-20 tokens to start. They started out as simply numbers stored on Reddit's servers. Donuts transitioned to be decentralized in late 2019 & early 2020.</p>
                </div>
                <div className="faq-odd">
                    <p className="faq-q">Q: Is this idea of community points being tried elsewhere on Reddit?</p>

                    <p className="faq-a">A: Yes. Both r/cryptocurrency and r/FortNiteBR have a test implementation of Reddit community points implemented. Both of those currencies are running on Ethereum test networks. Donuts are the only implementation running on the Ethereum mainnet.</p>
                    <p className="faq-a">Ethereum scaling is necessary if the idea is to be fully rolled out, however. Reddit launched the "Scaling Bake-Off" in Summer 2020 to see what layer 2 scaling solutions could potentially accomplish this. Reddit also announced a partnership with the Ethereum Foundation in January 2021 to work together and tackle the scaling problem.</p>
                </div>
                




            </div>
        );
    }


}

export default Faq;