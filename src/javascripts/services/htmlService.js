// anchorme finds URLs and converts to <a> tags
import anchorme from '../../libs/anchorme.js';


function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function removeSpaces(text) {
  return text
    .replace(/ ([\n\(\)\[\]<>]|&#39;|&quot;) /g, (matchedChar) => 
      matchedChar.substring(1, matchedChar.length - 1)
    );
}

export default function (text) {
  var htmlEscapedMessage = escapeHtml(text);
  //anchorme plugin wraps URLs in <a> tags
  var messageWithLinksEncoded = anchorme.js(htmlEscapedMessage, {html: false});
  var wholeMessage = messageWithLinksEncoded.join(' ');
  //remove extra spaces inserted by anchorme
  var wholeMessageTidied = removeSpaces(wholeMessage);
  //html encode forward slash unless in </a>
  return wholeMessageTidied.replace(/\/(?!a>)/g, '&#x2F;');
};
