import React from 'react';
import { motion } from 'framer-motion';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#222222] rounded-2xl p-8 md:p-12 shadow-xl text-gray-300 leading-relaxed space-y-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-[#222222] pb-6">
              Disclaimer
            </h1>
            <div className="space-y-4">
              <p>
                The information, content, courses, training programs, mentorship sessions, communications, and other materials provided by Bimal Institute for Market Research Private Limited, <strong>a company incorporated under the provisions of the Companies Act, 2013 (“Company” / “Institute” / “we” / “our” / “us”)</strong> through its website <a href="https://www.bimalinstitute.com/" className="text-primary hover:text-primary-light underline" target="_blank" rel="noopener noreferrer">https://www.bimalinstitute.com/</a> and any associated platforms, applications, or communication channels (collectively, the <strong>“Platform”</strong>) are intended solely for educational and informational purposes. All content made available by the Institute is of a general nature and is not tailored to the specific objectives, financial situation, or needs of any individual User. The Institute does not undertake any obligation to provide personalised advice or recommendations.
              </p>
              <p>
                Nothing provided by the Institute, whether through the Platform, live sessions, recorded content, communications, or otherwise, constitutes or shall be construed as investment advice, financial advice, trading advice, legal advice, or any form of recommendation or solicitation to buy, sell, trade, hold, or otherwise deal in any financial instrument, security, cryptocurrency, foreign exchange product, or any other asset. No content provided by the Institute shall be deemed to constitute an offer, invitation, endorsement, or inducement to engage in any trading or investment activity.
              </p>
              <p>
                Users acknowledge that any reliance on the information provided by the Institute is solely at their own risk, and the Institute shall not be responsible for any decisions taken by Users based on such information.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. NO ADVISORY OR PROFESSIONAL RELATIONSHIP</h2>
            <div className="space-y-3">
              <p>
                The Institute does not act as an investment advisor, financial advisor, research analyst, portfolio manager, broker, intermediary, or in any other regulated or advisory capacity under applicable law. Nothing contained in the content, courses, training programs, mentorship sessions, communications, or any other material provided by the Institute shall be construed as creating any advisory, fiduciary, agency, or professional relationship between the Institute and the User.
              </p>
              <p>
                No interaction, communication, or engagement with the Institute, whether through the Platform or otherwise, shall give rise to any duty of care or obligation on the part of the Institute to provide advice or recommendations tailored to the User. Users acknowledge that they are solely responsible for evaluating the merits and risks associated with any financial or trading decision and are advised to seek independent professional advice before making any such decisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. CRYPTOCURRENCY AND VIRTUAL DIGITAL ASSETS DISCLAIMER</h2>
            <div className="space-y-3">
              <p>
                Users acknowledge that Virtual Digital Assets, including cryptocurrencies, operate in a legally evolving and partially regulated environment in India, and may be subject to future restrictions, prohibitions, or regulatory actions by governmental or regulatory authorities. The Institute does not endorse, promote, recommend, or provide any advice in relation to investment, trading, or dealing in cryptocurrencies or other Virtual Digital Assets. Any references to cryptocurrencies or related technologies are made solely for educational and informational purposes, and shall not be construed as an invitation, solicitation, or recommendation to engage in any transaction or activity involving such assets.
              </p>
              <p>
                The Institute does not facilitate, enable, or assist in the purchase, sale, transfer, storage, or exchange of any Virtual Digital Assets, and Users are solely responsible for ensuring compliance with applicable laws and regulations in relation to any such activities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. FOREIGN EXCHANGE DISCLAIMER</h2>
            <div className="space-y-3">
              <p>
                Users acknowledge that participation in foreign exchange (forex) trading by residents in India is subject to regulatory restrictions and conditions under applicable law, and is permitted only through authorised dealers, recognised exchanges, and specified currency pairs. Participation in offshore or unauthorized forex trading platforms, including trading in non-permitted currency pairs or through unregulated intermediaries, may be unlawful and may result in regulatory or legal consequences.
              </p>
              <p>
                The Institute does not endorse, promote, recommend, or facilitate participation in any unauthorized forex trading activity or platform. Any content, discussions, or references relating to forex markets are provided solely for educational and informational purposes, and shall not be construed as advice, solicitation, or recommendation to engage in any forex transaction.
              </p>
              <p>
                Users are solely responsible for ensuring compliance with all applicable laws, regulations, and guidelines in relation to any forex trading or related activities.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. NO EXECUTION OR TRANSACTION FACILITATION</h2>
            <div className="space-y-3">
              <p>
                The Institute does not provide any facility or platform for the execution of trades or transactions in any financial instrument, security, cryptocurrency, or foreign exchange. Without prejudice to the generality of the foregoing, the Institute does not:
              </p>
              <ol className="list-[lower-alpha] pl-6 space-y-2 mt-2">
                <li>execute trades or transactions on behalf of Users;</li>
                <li>provide any brokerage, intermediary, or trading services;</li>
                <li>assist in opening, managing, or operating trading or investment accounts;</li>
                <li>facilitate onboarding of Users onto any third-party trading platforms; or</li>
                <li>facilitate transfer of funds for the purpose of trading or investment.</li>
              </ol>
              <p className="mt-4">
                All decisions relating to trading or investment activities are made independently by the User, and any interaction with third-party platforms shall be at the User’s sole discretion and risk.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. TRAINER AND CONTENT DISCLAIMER</h2>
            <div className="space-y-3">
              <p>
                All trainers, mentors, instructors, and representatives of the Institute are engaged solely for the purpose of providing <strong>educational and informational content.</strong> Such individuals are strictly prohibited from providing any form of <strong>personalised investment advice, financial recommendations, or trading tips</strong> to Users. Any opinions, views, discussions, examples, or statements made by trainers or representatives during sessions, whether live or recorded, are provided solely for educational purposes and shall not be construed as advice, recommendation, or endorsement of any trading or investment activity.
              </p>
              <p>
                In the event that any trainer or representative provides or is alleged to have provided any form of advice or recommendation, whether directly or indirectly, such act shall be deemed <strong>unauthorized,</strong> made in an individual capacity, and outside the scope of the Institute’s Services. The Institute shall not be responsible or liable for any reliance placed by Users on such unauthorized statements, and Users acknowledge that any such reliance shall be at their own risk.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. THIRD-PARTY DISCLAIMER</h2>
            <div className="space-y-3">
              <p>
                The Platform may contain references to, or facilitate access to, third-party platforms, tools, services, websites, or resources for informational or illustrative purposes. Such references do not constitute any endorsement, recommendation, or approval by the Institute of such third-party platforms or services.
              </p>
              <p>
                The Institute does not control, operate, or assume any responsibility for the accuracy, reliability, legality, security, or performance of any third-party platforms or services, including any trading platforms, exchanges, or applications. Any interaction, engagement, or transaction undertaken by Users with such third parties shall be at the User’s sole discretion and risk, and the Institute shall not be liable for any loss, damage, or consequences arising therefrom.
              </p>
              <p>
                Users are advised to independently review the terms, policies, and legal compliance status of any third-party platform before engaging with it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. LIMITATION OF LIABILITY</h2>
            <div className="space-y-3">
              <p>
                To the fullest extent permitted under applicable law, the Institute shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages, including but not limited to loss of profits, loss of capital, loss of opportunity, loss of data, or business interruption, arising out of or in connection with:
              </p>
              <ol className="list-[lower-alpha] pl-6 space-y-2 mt-2">
                <li>access to or use of, or inability to access or use, the Platform or Services;</li>
                <li>reliance on any information, content, materials, or communications provided by the Institute;</li>
                <li>any financial, trading, or investment decisions made by the User;</li>
                <li>any interactions, transactions, or engagements with third-party platforms, services, or providers; or</li>
                <li>any unauthorized acts, statements, or conduct of trainers, mentors, or other representatives.</li>
              </ol>
              <p className="mt-4">
                The Institute makes no warranties or representations, express or implied, regarding the accuracy, completeness, reliability, or suitability of any content provided, and all Services are provided on an “as is” and “as available” basis. Without prejudice to the foregoing, the total aggregate liability of the Institute, if any, arising out of or in connection with the use of the Platform or Services shall not exceed the amount actually paid by the User to the Institute for the relevant Service.
              </p>
              <p>
                Users acknowledge and agree that the Institute shall not be responsible for any losses arising from market conditions, volatility, regulatory changes, or any other factors beyond its control.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. ACCEPTANCE AND GOVERNING FRAMEWORK</h2>
            <div className="space-y-3">
              <p>
                By accessing or using the Platform or Services, the User acknowledges that they have read, understood, and agreed to be bound by this Disclaimer. This Disclaimer shall be read in conjunction with the Institute’s Terms of Service, Privacy Policy, and other applicable policies governing use of the Platform.
              </p>
              <p>
                This Disclaimer shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Disclaimer shall be subject to the exclusive jurisdiction of the competent courts at Indore, Madhya Pradesh.
              </p>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
};

export default Disclaimer;
