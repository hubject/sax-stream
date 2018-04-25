import * as Stream from 'stream';

export interface SAXStreamOptions {

    /**
     * if set to `true`, removes namespace prefix of elements
     */
    omitNsPrefix: boolean;

    /**
     * name of the tag to select objects from XML file (this or `tags` is required)
     */
    tag: string;

    /**
     * name of tags to select objects from XML file (this or `tag` is required)
     */
    tags: string;

    /**
     * size of internal transform stream buffer - defaults to 350 objects
     */
    highWaterMark: boolean;

    /**
     * default to false, if `true` makes sax parser to accept valid XML only
     */
    strict: boolean;

}

interface SAXOptions {
    trim?: boolean;
    normalize?: boolean;
    lowercase?: boolean;
    xmlns?: boolean;
    noscript?: boolean;
    position?: boolean;
}


export default function saxStream(options: SAXStreamOptions & SAXOptions): Stream;