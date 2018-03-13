using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus;
using YJY_COMMON;
using YJY_COMMON.Model.Queue;
using YJY_COMMON.Service;
using YJY_COMMON.Util;

namespace YJY_JOBS
{
    class PositionClose
    {
        // Connection String for the namespace can be obtained from the Azure portal under the 
        // 'Shared Access policies' section.
        private static readonly string ServiceBusConnectionString =
            YJYGlobal.GetConfigurationSetting("ServiceBusConnectionString");

        const string QueueName = "positiontoclose";
        static IQueueClient queueClient;

        public static void Run()
        {
            YJYGlobal.LogLine("Starting...");

            queueClient = new QueueClient(ServiceBusConnectionString, QueueName);

            // Register QueueClient's MessageHandler and receive messages in a loop
            RegisterOnMessageHandlerAndReceiveMessages();

            YJYGlobal.LogLine("Receiving messages...");

            while (true)
            {
                Thread.Sleep(TimeSpan.FromSeconds(1));
            }
        }

        //static async Task MainAsync()
        //{
        //    queueClient = new QueueClient(ServiceBusConnectionString, QueueName);

        //    YJYGlobal.LogLine("======================================================");
        //    YJYGlobal.LogLine("Press ENTER key to exit after receiving all the messages.");
        //    YJYGlobal.LogLine("======================================================");

        //    // Register QueueClient's MessageHandler and receive messages in a loop
        //    RegisterOnMessageHandlerAndReceiveMessages();

        //    Console.ReadKey();

        //    await queueClient.CloseAsync();
        //}

        static void RegisterOnMessageHandlerAndReceiveMessages()
        {
            // Configure the MessageHandler Options in terms of exception handling, number of concurrent messages to deliver etc.
            var messageHandlerOptions = new MessageHandlerOptions(ExceptionReceivedHandler)
            {
                // Maximum number of Concurrent calls to the callback `ProcessMessagesAsync`, set to 1 for simplicity.
                // Set it according to how many messages the application wants to process in parallel.
                MaxConcurrentCalls = 1,

                // Indicates whether MessagePump should automatically complete the messages after returning from User Callback.
                // False below indicates the Complete will be handled by the User Callback as in `ProcessMessagesAsync` below.
                AutoComplete = false
            };

            // Register the function that will process messages
            queueClient.RegisterMessageHandler(ProcessMessagesAsync, messageHandlerOptions);
        }

        static async Task ProcessMessagesAsync(Message message, CancellationToken token)
        {
            // Process the message
            //YJYGlobal.LogLine($"Received message: SequenceNumber:{message.SystemProperties.SequenceNumber}");

            try
            {
                var posToClose = Serialization.ByteArrayToObject(message.Body) as PosToClose;
                YJYGlobal.LogLine(
                    $"Received: {posToClose.Id} {posToClose.closeType} {posToClose.closePx} {posToClose.closePxTime}");
                var autoClosePosition = PositionService.AutoClosePosition(posToClose);

                YJYGlobal.LogLine(
                    $"pos closed: {autoClosePosition.Id} type:{autoClosePosition.CloseType} pl:{autoClosePosition.PL}");

                // Complete the message so that it is not received again.
                // This can be done only if the queueClient is created in ReceiveMode.PeekLock mode (which is default).
                await queueClient.CompleteAsync(message.SystemProperties.LockToken);

                // Note: Use the cancellationToken passed as necessary to determine if the queueClient has already been closed.
                // If queueClient has already been Closed, you may chose to not call CompleteAsync() or AbandonAsync() etc. calls 
                // to avoid unnecessary exceptions.
            }
            catch (Exception e)
            {
                YJYGlobal.LogException(e);

                await queueClient.AbandonAsync(message.SystemProperties.LockToken);
            }
        }

        static Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            YJYGlobal.LogLine($"Message handler encountered an exception {exceptionReceivedEventArgs.Exception}.");
            var context = exceptionReceivedEventArgs.ExceptionReceivedContext;
            YJYGlobal.LogLine("Exception context for troubleshooting:");
            YJYGlobal.LogLine($"- Endpoint: {context.Endpoint}");
            YJYGlobal.LogLine($"- Entity Path: {context.EntityPath}");
            YJYGlobal.LogLine($"- Executing Action: {context.Action}");
            return Task.CompletedTask;
        }
    }
}