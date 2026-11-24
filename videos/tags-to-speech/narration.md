# Narration for tags-to-speech.mp4

One line per step of the video. The times are when the step is on screen; start each line at its start time. Lines
are written for a calm pace of about 2.5 words a second. The video is 55 seconds, plus 1.5 seconds on the last
frame.

| Time | On screen | Say |
| --- | --- | --- |
| 0:00 to 0:04 | Title | A screen reader never reads your code. |
| 0:04 to 0:07 | The HTML table | On the web, you write HTML. |
| 0:07 to 0:10 | Arrow to the browser's tree | The browser turns it into a tree. |
| 0:10 to 0:12 | The cell 9 and its headers light up | Each cell arrives with its headers. |
| 0:12 to 0:15 | The rules box: HTML-AAM, Core-AAM | Those rules are written down. Every browser follows them. |
| 0:15 to 0:19 | The same table in every browser | So testing the page tells you what a screen reader will get. |
| 0:19 to 0:23 | The PDF's tags | A PDF has tags instead. Same table, same headers. |
| 0:23 to 0:26 | PDF/UA validation passes | A validator checks the tags, and this file passes. |
| 0:26 to 0:29 | The rules box: PDF-AAM, a draft | But the rules for viewers are still an early draft. |
| 0:29 to 0:34 | Firefox | Firefox builds the table, but with no size. VoiceOver says: table not found. |
| 0:34 to 0:39 | Chrome | Chrome builds no table at all, only lines of text. Again: table not found. |
| 0:39 to 0:44 | Safari | Safari builds the table as it was written, and VoiceOver reads it. |
| 0:44 to 0:48 | All three | One valid file. Three results. |
| 0:48 to 0:55 | Web and PDF side by side | A passing PDF check says the file is right, not that it is read right. The full story is in the post. |

If a line does not fit when read aloud, the step can be made longer: the times are the `data-in` and `data-out`
values in `index.html`, and `steps` and `total` in its script.
