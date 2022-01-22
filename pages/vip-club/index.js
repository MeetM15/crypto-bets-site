/* eslint-disable react/no-unescaped-entities */
import Layout from "../../components/layout/Layout";
import Head from "next/head";
const VipClub = () => {
  return (
    <>
      <Head>
        <title>Dice Up | VIP Club</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Layout>
        <div className="w-11/12 xl:w-256 flex flex-col gap-8 py-8">
          <div
            className="mt-20 w-full h-40 xl:h-76 rounded-2xl flex items-center justify-center"
            style={{ backgroundImage: "url('/vipdivbg.svg')" }}>
            <img
              className="h-16 w-auto p-1"
              src="/icons/vippagelogo.svg"
              alt="logo"
            />
          </div>
          <div className="flex flex-wrap lg:flex-nowrap w-full gap-4">
            <div className="flex items-center justify-center text-5xl leading-tight w-full lg:w-2/5 font-bold text-black">
              VIP Club - Exclusive <br /> Player Benefits
            </div>
            <div className="w-full lg:w-3/5 flex items-center justify-center text-md font-medium text-btntext">
              Primedice is where you come to get the most out of your gambling
              experience.Why would you settle for anything less? Our "players
              are treated like royalty from the minute they step onto the site,
              with loyalty programs that are the best in the world" of crypto
              gambling. "Whether you are a long-time Primedice member or you
              have just joined the site, you are important to us! We are focused
              on" enhancing your gambling experience and committed to offering
              exclusive benefits to all of our players - like no other website
              can.
            </div>
          </div>
          <div className="flex flex-col w-full gap-4 bg-secondary p-12 rounded-2xl">
            <div className="w-full font-bold text-3xl">Loyalty Progression</div>
            <div className="w-32 h-1 bg-primary-100 rounded-2xl"></div>
            <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
              "Our players also have the chance to progress their rank all the
              way to Diamond,which comes with inherent player benefits. Your
              involvement in the Primedice community and"
            </div>
            <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
              "the amount you wager within all our games come with rewards and
              certainly some recognition.We value all of our players, and we'd
              love to see even our newest players progress all the way to
              Diamond!We are all about giving the absolute best to our players."
            </div>
          </div>
          <div className="flex items-center text-center justify-center text-5xl leading-tight w-full font-bold text-black">
            What you get as a VIP <br /> Member?
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/personal.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">Personal VIP</div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                Receive personal VIP treatment from our "support team,with
                one-on-one chats and personal support that is unique to you!
                Don't be satisfied with automated messages,you are" important to
                us.
              </div>
            </div>
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/rakeback.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">Rakeback</div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                Rakeback is also a limitless possibility to our "loyal members,
                with no restriction on when you can claim rakeback into your
                account. We are committed to giving back to our loyal" players.
              </div>
            </div>
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/bonus.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">
                Exclusive Bonuses
              </div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                Loyal members also have access to exclusive bonuses that you
                will not get on other websites - make the most of your
                importance!
              </div>
            </div>
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/speciality.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">
                Speciality Challenges
              </div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                Take on challenges unique to you, where only you can win! more
                could you want?
              </div>
            </div>
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/addmore.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">And More!</div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                If you feel like we are missin something, let us know! We are
                more than willing to cater to any player needs or requests.
              </div>
            </div>
            <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
              <img
                className="h-24 w-auto p-1"
                src="/vipLvls/gift.svg"
                alt="logo"
              />
              <div className="w-full font-bold text-xl mt-4">
                Gifts & Rewards
              </div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                Receive gifts and rewards that have no boundaries - the sky is
                the limit. This doesn't just include virtual gifts, but physial
                also. Who knows what kind of things Diceup.com will have you
                doing!
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default VipClub;
