var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: '',
}).startRTM()

controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello bitch.');
});


var addReaction = function(response, user, bot, reaction) {
  controller.storage.users.get(response.user, function(err, user) {
      if (!user) {
          user = {
              id: response.user,
              inventory: []
          };
      }
      user.inventory.push(reaction)
      console.log("USER", user)
      controller.storage.users.save(user, function(err, id) {
      });

      for (var i = 0; i < user.inventory.length; i++) {
        bot.api.reactions.add({
            timestamp: response.ts,
            channel: response.channel,
            name: user.inventory[i],
        }, function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(', err);
            }
        })
      }
  });

  console.log("user: ", user)

}


controller.hears(['lets play a game'], ['direct_message','direct_mention','mention'], function(bot,message) {
    gameStart = function(response, convo) {
      convo.ask('Welcome to GAME! Are you ready to play?', function(response, convo) {
        console.log("Response: ", response)
        switch (response.text) {
          case 'yes':
            bot.api.reactions.add({
                timestamp: response.ts,
                channel: response.channel,
                name: 'house',
            }, function(err, res) {
                if (err) {
                    bot.botkit.log('Failed to add emoji reaction :(', err);
                }
            })
            convo.say("West of House This is an open field west of a white house, with a boarded front door. There is a small mailbox here. A rubber mat saying \'Welcome to Zork!\' lies by the door.")
            addReaction(response, message.user, bot, 'bus')

            askDirection(response, convo)
            convo.next()
            break
          case 'no':
            convo.say('okay, go away now.')
            break
        }
        convo.next();
      });
    }

    bot.startConversation(message, gameStart);
});
