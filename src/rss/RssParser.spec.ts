import { expect } from "chai";
import "mocha";
import { RssParser } from "./RssParser";
import { JSDOM } from "jsdom";

describe("RSS Parser", function () {
    before(function () {
        // Since the tests are running on Node.js and it misses a DOMParser, we need
        // to use a parser from a different package and inject it.
        let window = new JSDOM().window;
        global.DOMParser = window.DOMParser;
    })

    it("parses channel with items", function() {
        const parser = new RssParser();
        return parser.parse(rssSample2Items)
            .then((channel) => {
                expect(channel.title).to.be.equal("test title");
                expect(channel.link).to.be.equal("https://example.com");
                expect(channel.description).to.be.equal("test channel description");
                expect(channel.lastBuildDate?.getTime()).to.be.equal(1654679349000);
                expect(channel.pubDate).to.be.null;                
                expect(channel.items.length).to.be.equal(2);                
                expect(channel.lastestGuid()).to.be.equal("guid-item-1");

                const item1 = channel.items[0];
                expect(item1.title).to.be.equal("item 1");
                expect(item1.description).to.be.equal("item 1 description");
                expect(item1.link).to.be.equal("https://example.com/item-1");
                expect(item1.guid).to.be.equal("guid-item-1");
                expect(item1.pubDate?.getTime()).to.be.equal(1654506549000);
                expect(item1.categories.length).to.be.equal(3);
                expect(item1.categories).to.eql(["cat1", "cat2", "cat4"]);
                
                const item2 = channel.items[1];
                expect(item2.title).to.be.equal("item 2");
                expect(item2.description).to.be.equal("item 2 description");
                expect(item2.link).to.be.equal("https://example.com/item-2");
                expect(item2.guid).to.be.equal("guid-item-2");
                expect(item2.pubDate).is.null;
                expect(item2.categories.length).to.be.equal(3);
                expect(item2.categories).to.eql(["cat3", "cat4", "cat5"]);
            });
    });
});

const rssSample2Items = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:taxo="http://purl.org/rss/1.0/modules/taxonomy/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">
    <channel>
        <title>test title</title>
        <link>https://example.com</link>
        <description>test channel description</description>
        <lastBuildDate>Wed, 08 Jun 2022 09:09:09 GMT</lastBuildDate>
        <image>
            <url>https://example.com/favicon.png</url>
            <title>example.com</title>
            <link>https://example.com/</link>
            <width>32</width>
            <height>32</height>
        </image>
        <item>
            <title>item 1</title>
            <description>item 1 description</description>
            <link>https://example.com/item-1</link>
            <category>cat1</category>
            <category>cat2</category>
            <category>cat4</category>
            <guid isPermaLink="false">guid-item-1</guid>
            <pubDate>Mon, 06 Jun 2022 09:09:09 GMT</pubDate>
        </item>
        <item>
            <title>item 2</title>
            <description>item 2 description</description>
            <link>https://example.com/item-2</link>
            <category>cat3</category>
            <category>cat4</category>
            <category>cat5</category>
            <guid isPermaLink="false">guid-item-2</guid>
        </item>
    </channel>
</rss>`;