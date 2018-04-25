import {Transform} from 'stream';

export interface SAXStreamBaseOptions {

    /**
     * if set to `true`, removes namespace prefix of elements
     */
    omitNsPrefix?: boolean;

    /**
     * if set to `true`, removes properties with empty values
     */
    omitEmpty?: boolean;

    /**
     * size of internal transform stream buffer - defaults to 350 objects
     */
    highWaterMark?: boolean;

    /**
     * default to false, if `true` makes sax parser to accept valid XML only
     */
    strict?: boolean;
}

export interface SAXStreamTagOptions extends SAXStreamBaseOptions {

    /**
     * name of the tag to select objects from XML file (this or `tags` is required)
     */
    tag: string;
}

export interface SAXStreamTagsOptions extends SAXStreamBaseOptions {

    /**
     * name of tags to select objects from XML file (this or `tag` is required)
     */
    tags: string[];
}

interface SAXOptions {
    trim?: boolean;
    normalize?: boolean;
    lowercase?: boolean;
    xmlns?: boolean;
    noscript?: boolean;
    position?: boolean;
}

export type SAXStreamOptions = (SAXStreamTagOptions | SAXStreamTagsOptions) & SAXOptions;

export default function saxStream(options: SAXStreamOptions): Transform;
