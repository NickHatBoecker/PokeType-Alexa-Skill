/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const TYPE_TABLE = [
    { id: 'Normal', effectiveTypes: ['Kampf'] },
    { id: 'Feuer', effectiveTypes: ['Boden', 'Wasser', 'Gestein'] },
    { id: 'Wasser', effectiveTypes: ['Pflanze', 'Elektro'] },
    { id: 'Pflanze', effectiveTypes: ['Feuer', 'Eis', 'Gift', 'Flug', 'Käfer'] },
    { id: 'Elektro', effectiveTypes: ['Boden'] },
    { id: 'Eis', effectiveTypes: ['Feuer', 'Kampf', 'Gestein', 'Stahl'] },
    { id: 'Kampf', effectiveTypes: ['Flug', 'Psycho', 'Fee'] },
    { id: 'Gift', effectiveTypes: ['Boden', 'Psycho'] },
    { id: 'Boden', effectiveTypes: ['Wasser', 'Pflanze', 'Eis'] },
    { id: 'Flug', effectiveTypes: ['Elektro', 'Eis', 'Gestein'] },
    { id: 'Psycho', effectiveTypes: ['Käfer', 'Geist', 'Unlicht'] },
    { id: 'Käfer', effectiveTypes: ['Feuer', 'Flug', 'Gestein'] },
    { id: 'Gestein', effectiveTypes: ['Wasser', 'Pflanze', 'Kampf', 'Boden', 'Stahl'] },
    { id: 'Geist', effectiveTypes: ['Geist', 'Unlicht'] },
    { id: 'Drache', effectiveTypes: ['Eis', 'Drache', 'Fee'] },
    { id: 'Unlicht', effectiveTypes: ['Kampf', 'Käfer', 'Fee'] },
    { id: 'Stahl', effectiveTypes: ['Feuer', 'Kampf', 'Boden'] },
    { id: 'Fee', effectiveTypes: ['Gift', 'Stahl'] },
];

function ucfirst (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinTypes (list) {
    const last = list.pop();
    const result = `${list.join(', ')} und ${last}`;

    return result;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hallo, du kannst mich fragen "welcher Typ ist gut gegen Feuer" oder du sagst "Hilfe" und ich nenne dir weitere Beispiele.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PokeTypeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PokeTypeIntent';
    },
    
    /**
     * @TODO Add second type
     */
    handle(handlerInput) {
        const errorMessage = 'Tut mir leid, diesen Typen kenne ich nicht.';
        const typeOne = handlerInput.requestEnvelope.request.intent.slots['TYPE_ONE'].value || null
        if (!typeOne) {
            return handlerInput.responseBuilder
            .speak(errorMessage)
            .getResponse();
        }
        
        let speakOutput = errorMessage;
        
        try {
            const effectiveTypes = TYPE_TABLE.find(x => x.id.toLowerCase() === typeOne.toLowerCase()).effectiveTypes || [];
            
            if (effectiveTypes.length === 1) {
                speakOutput = `Gegen den Typ ${ucfirst(typeOne)} ist ${effectiveTypes[0]} effektiv.`;
            } else if (effectiveTypes.length > 1) {
                speakOutput = `Gegen den Typ ${ucfirst(typeOne)} sind ${joinTypes(effectiveTypes)} Attacken effektiv.`;
            }
        } catch (e) {
            // Do nothing
            console.log(e);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Steckst du in einem hitzigen Kampf und weißt nicht welches Monster du gegen deinen Gegner einsetzen sollst? Sag "Alexa, frag professor eich welcher Typ gegen Wasser effektiv ist". Aktuell unterstütze ich leider nur einfache Typen und keine Doppeltypen. Es gibt noch viele andere Formulierungen, die ich verstehe. Zum Beispiel "Alexa, frag professor eich, was ist gut gegen Gestein?".';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Danke, dass du diesen Skill ausprobiert hast! Über eine Bewertung im Skill Store würde ich mich sehr freuen.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Tut mir leid, das habe ich leider nicht verstanden. Bitte versuche es erneut.';
        console.log(handlerInput);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Du hast den Intent ${intentName} ausgelöst`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Tut mir leid, ich habe Probleme dich zu verstehen. Bitte versuche es erneut.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PokeTypeIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('nhb/pocketprofessor/v1.2')
    .lambda();