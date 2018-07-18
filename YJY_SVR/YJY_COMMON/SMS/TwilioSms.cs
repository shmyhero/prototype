using System;
using Twilio;
using Twilio.Base;
using Twilio.Clients;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;

namespace YJY_COMMON.SMS
{
    public class TwilioSMS
    {
        // Find your Account Sid and Token at twilio.com/console
        private const string AccountSid = "AC11ba79a56d435dbe6a76dff5762b7c1e";
        private const string AuthToken = "c3a2e0b62a6d2709c5d823d25bf3f0fe";
        private const string From = "+18448556615";

        private static TwilioRestClient _client;

        static TwilioSMS()
        {
            _client = new TwilioRestClient(AccountSid, AuthToken);
        }

        public static bool SendSMS(string to, string text, out string failMsg)
        {
            failMsg = null;

            //TwilioClient.Init(AccountSid, AuthToken);

            try
            {
                var message = MessageResource.Create(
                    body: text,
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