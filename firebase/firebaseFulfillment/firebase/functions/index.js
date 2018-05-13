// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

//V11

const wordListAL = require('./words-large-al.js').wordListAL; // First half of exclusion list
const wordListMZ = require('./words-large-mz.js').wordListMZ; // Second half of exclusion list
const wordList = wordListAL.concat(wordListMZ);
const wordListExtra = require('./words-extra.js').wordListExtra; // Manual addition exclusion list
 
const cardImage = 'https://mywordmaker.firebaseapp.com/wm_md.png';

const functions = require('firebase-functions');
const {WebhookClient, Text, Card, Suggestion} = require('dialogflow-fulfillment');
const suffixes = ['able', 'acy', 'ade', 'age', 'al', 'an', 'ance', 'ancy', 'ant', 'ar', 'ard', 'art', 'ary', 'ate', 'ate', 'ate', 'ation', 'ative', 'cade', 'cy', 'drome', 'ed', 'ed', 'en', 'en', 'ence', 'ence', 'ency', 'ent', 'eous', 'er', 'ery', 'es', 'ess', 'est', 'fold', 'ful', 'fy', 'ia', 'ial', 'ian', 'iatry', 'ible', 'ic', 'ic', 'ical', 'ice', 'ient', 'ier', 'ies', 'ies', 'iest', 'ify', 'ile', 'ing', 'ing', 'ing', 'ion', 'ious', 'ish', 'ism', 'ist', 'ite', 'itive', 'ity', 'ive', 'ive', 'ize', 'less', 'ly', 'ment', 'ness', 'or', 'ory', 'ose', 'ous', 'ship', 'ster', 'ty', 'ure', 'ward', 'wise', 'y'];
const roots = ['a', 'ab', 'abs', 'ac', 'acer', 'acid', 'acri', 'act', 'acu', 'ad', 'aer', 'aero', 'af', 'ag', 'agi', 'agri', 'agro', 'al', 'alb', 'albo', 'ali', 'allo', 'alt', 'alter', 'am', 'ambi', 'ambul', 'ami', 'amor', 'an', 'ana', 'andr', 'andro', 'ang', 'anim', 'ann', 'annu', 'ano', 'ant', 'ante', 'anthrop', 'anti', 'antico', 'ap', 'aph', 'apo', 'aqu', 'arch', 'as', 'aster', 'astr', 'at', 'auc', 'aud', 'audi', 'aug', 'aug', 'aur', 'aus', 'aut', 'auto', 'bar', 'be', 'belli', 'bene', 'bi', 'bibl', 'bibli', 'biblio', 'bine', 'bio', 'brev', 'cad', 'calor', 'cap', 'capit', 'capt', 'cardi', 'carn', 'cas', 'cat', 'cata', 'cath', 'caus', 'cause', 'caut', 'ceas', 'ced', 'cede', 'ceed', 'ceiv', 'cent', 'centr', 'centri', 'cept', 'cess', 'chrom', 'chron', 'cid', 'cide', 'cip', 'circum', 'cis', 'cise', 'cit', 'civ', 'claim', 'clam', 'clin', 'clud', 'clus', 'claus', 'co', 'cog', 'cogn', 'col', 'coll', 'com', 'con', 'contr', 'contra', 'cor', 'cord', 'corp', 'cort', 'cosm', 'counter', 'cour', 'cracy', 'crat', 'cre', 'crea', 'crease', 'cred', 'cresc', 'cret', 'crit', 'cru', 'cur', 'cura', 'curr', 'curs', 'cus', 'cuse', 'cycl', 'cyclo', 'de', 'dec', 'deca', 'dei', 'dem', 'demo', 'dent', 'derm', 'di', 'dia', 'dic', 'dict', 'dif', 'dign', 'dis', 'dit', 'div', 'doc', 'doct', 'domin', 'don', 'dont', 'dorm', 'dox', 'duc', 'duct', 'dura', 'dy', 'dynam', 'dys', 'e', 'ec', 'eco', 'ecto', 'em', 'en', 'end', 'enni', 'epi', 'equi', 'erg', 'et', 'ev', 'ex', 'exter', 'extra', 'extro', 'fa', 'fac', 'fact', 'fain', 'fall', 'fals', 'fan', 'fant', 'fas', 'fea', 'feat', 'fec', 'fect', 'feder', 'feign', 'femto', 'fer', 'fess', 'fic', 'fic', 'fid', 'fide', 'fig', 'fila', 'fili', 'fin', 'fit', 'fix', 'flect', 'flex', 'flict', 'flu', 'fluc', 'fluv', 'flux', 'for', 'forc', 'fore', 'form', 'fort', 'fract', 'frag', 'frai', 'fuge', 'fuse', 'gam', 'gastr', 'gastro', 'gen', 'geo', 'germ', 'gest', 'giga', 'gin', 'glo', 'gloss', 'glot', 'glu', 'gnant', 'gnos', 'gor', 'grad', 'graf', 'gram', 'graph', 'grat', 'grav', 'gree', 'greg', 'gress', 'hale', 'heal', 'helio', 'hema', 'hemo', 'her', 'here', 'hes', 'hetero', 'hex', 'homo', 'hum', 'human', 'hydr', 'hydra', 'hydro', 'hyper', 'hypn', 'ics', 'ig', 'ignis', 'il', 'im', 'in', 'infra', 'inter', 'intra', 'intro', 'ir', 'jac', 'ject', 'join', 'judice', 'jug', 'junct', 'just', 'juven', 'kilo', 'labor', 'lau', 'lav', 'leag', 'lect', 'leg', 'levi', 'lex', 'liber', 'lide', 'lig', 'liter', 'liver', 'loc', 'loco', 'locut', 'log', 'logo', 'loqu', 'lot', 'luc', 'lude', 'lum', 'lun', 'lus', 'lust', 'lut', 'macer', 'macr', 'magn', 'main', 'mal', 'man', 'mand', 'mania', 'manu', 'mar', 'mari', 'matri', 'medi', 'mega', 'mem', 'ment', 'mer', 'meso', 'meta', 'meter', 'metr', 'micro', 'migra', 'mill', 'milli', 'min', 'mis', 'miss', 'mit', 'mob', 'mon', 'mono', 'mor', 'morph', 'mort', 'mot', 'mov', 'multi', 'nai', 'nano', 'nasc', 'nat', 'neo', 'neur', 'noc', 'nom', 'nomen', 'nomin', 'non', 'nov', 'nox', 'numer', 'numisma', 'nym', 'ob', 'oc', 'oct', 'of', 'oligo', 'ology', 'omni', 'onym', 'op', 'oper', 'ortho', 'over', 'pac', 'pair', 'paleo', 'pan', 'para', 'pare', 'pass', 'pat', 'pater', 'path', 'pathy', 'patr', 'ped', 'pedo', 'pel', 'pend', 'pens', 'penta', 'per', 'peri', 'phage', 'phan', 'phant', 'phas', 'phe', 'phen', 'phil', 'phlegma', 'phobia', 'phobos', 'phon', 'phot', 'photo', 'pico', 'pict', 'plac', 'plais', 'pli', 'plore', 'plu', 'plur', 'plus', 'ply', 'pneuma', 'pneumon', 'pod', 'poli', 'poly', 'pon', 'pond', 'pop', 'port', 'portion', 'pos', 'post', 'pot', 'pound', 'pre', 'prehendere', 'prim', 'prime', 'prin', 'pro', 'proto', 'psych', 'puls', 'punct', 'pur', 'pute', 'quad', 'quat', 'quer', 'quest', 'quint', 'quip', 'quir', 'quis', 're', 'recti', 'reg', 'retro', 'ri', 'ridi', 'risi', 'rog', 'roga', 'rupt', 'sacr', 'salu', 'salv', 'sanc', 'sanct', 'sat', 'satis', 'scen', 'sci', 'scientia', 'scio', 'scope', 'scrib', 'script', 'se', 'sec', 'secr', 'sect', 'secu', 'sed', 'semi', 'sen', 'sens', 'sent', 'sept', 'sequ', 'serv', 'ses', 'sess', 'sid', 'sign', 'signi', 'simil', 'simul', 'sist', 'soci', 'sol', 'solu', 'solus', 'solut', 'solv', 'somn', 'soph', 'spec', 'spect', 'sper', 'sphere', 'spi', 'spic', 'spir', 'st', 'sta', 'sta', 'stab', 'stan', 'stand', 'stant', 'stat', 'stead', 'sti', 'stige', 'stit', 'strain', 'strict', 'string', 'stroy', 'stru', 'struct', 'stry', 'sub', 'suc', 'sue', 'suf', 'sume', 'sump', 'sup', 'super', 'supra', 'sur', 'sus', 'sym', 'syn', 'tact', 'tag', 'tain', 'tang', 'tect', 'teg', 'tele', 'tem', 'tempo', 'ten', 'tend', 'tens', 'tent', 'tera', 'term', 'terr', 'terra', 'test', 'the', 'theo', 'therm', 'thesis', 'thet', 'tig', 'tin', 'ting', 'tire', 'tom', 'tor', 'tors', 'tort', 'tox', 'tra', 'tract', 'trai', 'trans', 'treat', 'tri', 'trib', 'tribute', 'typ', 'ultima', 'umber', 'umbraticum', 'un', 'uni', 'vac', 'vade', 'vale', 'vali', 'valu', 'vect', 'veh', 'ven', 'vent', 'ver', 'verb', 'veri', 'vers', 'vert', 'verv', 'vi', 'vic', 'vicis', 'vict', 'vid', 'vinc', 'vis', 'vita', 'viv', 'vivi', 'voc', 'voke', 'vol', 'volcan', 'volt', 'volv', 'vor', 'with', 'zo'];
const varyRepeat = ['Would you like another new word?', 'Do you want to go again?', 'Shall I create another new word?', 'Shall I invent another new word?', 'Do you want another new word?', 'Do you want a fresh word?'];
const varyIntent = ['Would you like a new word?', 'Shall I create a new word?', 'Shall I invent a new word?', 'Do you want a fresh word?'];
const preTaglines = ['Here is your new word!', 'We hope you enjoy this made-up word!', 'Invented just for you!', 'This new word is one in forty million!'];
const totalPossible = (roots.length * roots.length * suffixes.length);
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
    }


  function randomWord(agent) {
    
    // let conv = agent.conv(); // Get Actions on Google library conv instance
    // let coro = ('I was supposed to give you a word here.'); // Use Actions on Google library
    
    // console.log('IntentActive');

    let thisWord = doMakeAWord();
    let wordOutput = '<speak>' ;
    
    //var spelled = thisWord.charAt(0);
            
    //  for (var i = 1; i < thisWord.length; i++) {
    //  spelled = spelled + ', ' + thisWord.charAt(i);
    //  }
            var thisRepeat = sayRepeat();
            wordOutput = wordOutput + ' Your new word is ' + thisWord + '. <say-as interpret-as="verbatim">' + thisWord + '</say-as>, ' + thisWord + '. ' + thisRepeat + '</speak>'; 
            var txtOutput = 'Your new word is ' + thisWord + '. ' + thisRepeat;
    
    // agent.add(wordOutput);
    // console.log(wordOutput);
    
    agent.add(new Text({
        ssml: wordOutput,
        text: txtOutput
        })
    );
     
     
    agent.add(new Card({
        title: thisWord,
        imageUrl: cardImage,
        text: sayTagLines()
       })
     );
  
 
  }
  
  function howMany(agent) {
      var wordOutput = 'Remoggle Word Maker can currently create approximately ' + totalPossible + ' unique nonsense words. ' + sayIntent();
      agent.add(wordOutput);
      
  }
  
    function randomWordWelcome(agent) {

    // let conv = agent.conv(); // Get Actions on Google library conv instance
    // let coro = ('I was supposed to give you a word here.'); // Use Actions on Google library
    
    let thisWord = doMakeAWord();
    let wordOutput = '<speak> Welcome to My Word Maker. ' ;
        //var spelled = thisWord.charAt(0);
            
           // for (var i = 1; i < thisWord.length; i++) {
           // spelled = spelled + ', ' + thisWord.charAt(i);
           //  }
            var thisRepeat = sayRepeat();
            wordOutput = wordOutput + ' Your new word is ' + thisWord + '. <say-as interpret-as="verbatim">' + thisWord + '</say-as>, ' + thisWord + '. ' + thisRepeat + '</speak>'; 
            var txtOutput = ' Welcome to My Word Maker. Your new word is ' + thisWord + '. ' + thisRepeat;
    
    agent.add(new Text({
        ssml: wordOutput,
        text: txtOutput
        })
    );
     
     
    agent.add(new Card({
        title: thisWord,
        imageUrl: cardImage,
        text: sayTagLines()
       })
     );
        
    }
  
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', randomWordWelcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('randomWord', randomWord);
  intentMap.set('randomWordyes', randomWord);
  intentMap.set('howManyYes', randomWord);
  intentMap.set('howMany', howMany);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});


 function doMakeAWord () {
  var wordLog = 'Test:';
 do{
     var root1 = roots[Math.floor(Math.random() * roots.length)]; // First part of word
     var word = root1;
            if (Math.random() >= 0.88) {   //  15% of the time add part of word
                word = word + roots[Math.floor(Math.random() * roots.length)];
            }
            if (Math.random() >= 0.998) {  // 0.5% of the time add another part of word
                word = word + roots[Math.floor(Math.random() * roots.length)];
            }
            var suffix = suffixes[Math.floor(Math.random() * suffixes.length)];   // Add Suffix
            word = word + suffix;
            wordLog = wordLog + ' ' + word;

 } while ((word.indexOf('ii') >= 0) || (word.indexOf('tj') >= 0) || (word.indexOf('mt') >= 0) || (word.indexOf('tf') >= 0) || (word.indexOf('tc') >= 0) || (word.indexOf('cp') >= 0) || (word.indexOf('mf') >= 0) || (word.indexOf('aa') >= 0) || (word.indexOf('bf') >= 0) || (word.indexOf('tg') >= 0) || (word.indexOf('tq') >= 0) || (word.indexOf('uu') >= 0) || (word.indexOf('dj') >= 0) || (wordList.indexOf(word.toUpperCase()) >= 0) || (wordListExtra.indexOf(word.toUpperCase()) >= 0))        
        console.info(wordLog + ' Choice: ' + word);
        return word;
        }
        
        
        function sayRepeat() {
    return varyRepeat[Math.floor(Math.random() * varyRepeat.length)];
}

function sayIntent() {
    return varyIntent[Math.floor(Math.random() * varyIntent.length)];
}

function sayTagLines() {
    return preTaglines[Math.floor(Math.random() * preTaglines.length)];
}

