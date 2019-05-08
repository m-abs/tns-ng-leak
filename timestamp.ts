import * as byline from 'byline';
import * as dateFormat from 'dateformat';

byline(process.stdin).on('data', (line) => {
  console.log(`${dateFormat('yyyy-mm-dd hh:MM:ss.l')}: ${line}`);
});
