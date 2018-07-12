using System;
using Twilio;
using Twilio.Clients;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;

namespace YJY_COMMON.SMS
{
    public class TwilioSMS
    {
        // Find your Account Sid and Token at twilio.com/console
        private const string AccountSid = "ACbb1717760f8c7b5a0cd57bdcc587c3db";
        private const string AuthToken = "85436388cba253152fbb6092af544c83";
        private const string From = "+18325582007";

        private static TwilioRestClient _client;

        static TwilioSMS()
        {
            _client = new TwilioRestClient(AccountSid, AuthToken);
        }

        public static bool SendVerificationCode(string to, string code, out string failMsg)
        {
            failMsg = null;

            //TwilioClient.Init(AccountSid, AuthToken);

            try
            {
                var message = MessageResource.Create(
                    body: "Bithero verification code: " + code,
                    from: new Twilio.Types.PhoneNumber(From),
                    to: new Twilio.Types.PhoneNumber(to),
                    client:_client
                );

                Console.WriteLine("Twilio SMS sent: " + message.Sid);

                return true;
            }
            catch (ApiException e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine($"Twilio Error {e.Code} - {e.MoreInfo}");

                failMsg = e.Message;
                return false;
            }
        }
    }
}