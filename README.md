# Litmus testing

## Media Queries

Media queries do not work in:

- Gmail App IMAP (Android 6) - no IMAP or POP accounts will use media queries
- Outlook (Android 7.0)
- Outlook iOS (11.3.1)
- Samsung Mail (Android 6.0)

Any Gmail app pre 2016 will not use media queries.

There's a full list here https://www.campaignmonitor.com/css/media-queries/media/

## Which media query you should use

`@media screen and (max-device-width: 414px) {
 Your code here
}`

- The iPhone XR pixel density is slightly bigger than usual mobile size of 400px. 414px should be the size you use.

## Images

- `<img />` usually needs a width i.e. `width="200"` for Outlook. Do not add px at the end of the width size.
- Styling cannot be applied to img's on any desktop version of Outlook (except Outlook 2019 macOS), Windows Mail. If you need to style around the image, wrap it in a table and style the td.
- When using Retina images, you have to specifiy a height and width on the image (without pixels) i.e. `<img width="600" height="300">`. This is because of Outlook. Outlook will ignore any css setting and show the image's full width. You can also set height: auto!important; to make sure it resizes for mobile.

## Paragraphs and headings

- Headings can be used but you need to set margins for Outlook to keep it consistent. 
- We are using paragraphs with h1, h2 classes for consistency
- Padding on paragraphs doesn't work in Outlook. Use margins instead.

## Padding & Margins

- Use capital M on margin for old versions of Outlook
- Outlook 2007 and 2010 will convert 
- Padding doesn't work on images or paragraphs in all versions of Outlook.
- `<td>` padding is generally safe as long as you’re not setting a width property or attribute. Outlook 2007 and 2010 will convert your width pixels to points, which doesn’t always translate as precisely as you may want.
- If you add margin or HTML email padding properties to your `<table>` element, it will add that same margin and padding to every nested `<td>` in Outlook 2007 and 2016

## Lists

- Use tables for lists as Outlook won't allow you to style bullet lists.

## Divs

- Outlook doesn’t acknowledge `<div>`s or their padding attributes

## Gmail bugs

- Gmail removes all CSS in <style> block if it exceeds 8192 characters or if it contains errors or nested @ declarations.
- You can target Gmail specifically with styles using this hack: https://freshinbox.com/blog/targeting-new-gmail-css/

## Useful links

These handy tools will show you what will and won't work in each email client
https://www.caniemail.com/scoreboard/
https://caniuse.email/

Create VML based buttons 
https://buttons.cm/ 

## iPhone notes

The minimum font size displayed on iPhones is 13 pixels. Keep this in mind when styling text, because anything smaller will be upscaled and could break your layout.
