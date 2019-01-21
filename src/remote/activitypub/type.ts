export type obj = { [x: string]: any };

export interface IObject {
	'@context': string | obj | obj[];
	type: string;
	id?: string;
	summary?: string;
	published?: string;
	cc?: string[];
	to?: string[];
	attributedTo: string;
	attachment?: any[];
	inReplyTo?: any;
	content: string;
	icon?: any;
	image?: any;
	url?: string;
	tag?: any[];
	sensitive?: boolean;
}

export interface IActivity extends IObject {
	//type: 'Activity';
	actor: IObject | string;
	object: IObject | string;
	target?: IObject | string;
}

export interface ICollection extends IObject {
	type: 'Collection';
	totalItems: number;
	items?: IObject | string | IObject[] | string[];
	current?: ICollectionPage;
	first?: ICollectionPage;
	last?: ICollectionPage;
}

export interface ICollectionPage extends IObject {
	type: 'CollectionPage';
	totalItems: number;
	items?: IObject | string | IObject[] | string[];
	current?: ICollectionPage;
	first?: ICollectionPage;
	last?: ICollectionPage;	partOf: string;
	next?: ICollectionPage;
	prev?: ICollectionPage;
}

export interface IOrderedCollection extends IObject {
	type: 'OrderedCollection';
	totalItems: number;
	orderedItems?: IObject | string | IObject[] | string[];
	current?: IOrderedCollectionPage;
	first?: IOrderedCollectionPage;
	last?: IOrderedCollectionPage;
}

export interface IOrderedCollectionPage extends IObject {
	type: 'OrderedCollectionPage';
	totalItems: number;
	orderedItems?: IObject | string | IObject[] | string[];
	current?: IOrderedCollectionPage;
	first?: IOrderedCollectionPage;
	last?: IOrderedCollectionPage;
	partOf: string;
	next?: IOrderedCollectionPage;
	prev?: IOrderedCollectionPage;
	startIndex?: number;
}

export interface INote extends IObject {
	type: 'Note';
	_misskey_content: string;
	_misskey_quote: string;
	_misskey_question: string;
}

export interface IPerson extends IObject {
	type: 'Person';
	name: string;
	preferredUsername: string;
	manuallyApprovesFollowers: boolean;
	inbox: string;
	sharedInbox?: string;
	publicKey: any;
	followers: any;
	following: any;
	featured?: any;
	outbox: any;
	endpoints: any;
}

export const isCollection = (object: IObject): object is ICollection =>
	object.type === 'Collection';

export const isOrderedCollection = (object: IObject): object is IOrderedCollection =>
	object.type === 'OrderedCollection';

export const isCollectionOrOrderedCollection = (object: IObject): object is ICollection | IOrderedCollection =>
	isCollection(object) || isOrderedCollection(object);

export interface ICreate extends IActivity {
	type: 'Create';
}

export interface IDelete extends IActivity {
	type: 'Delete';
}

export interface IUndo extends IActivity {
	type: 'Undo';
}

export interface IFollow extends IActivity {
	type: 'Follow';
}

export interface IAccept extends IActivity {
	type: 'Accept';
}

export interface IReject extends IActivity {
	type: 'Reject';
}

export interface IAdd extends IActivity {
	type: 'Add';
}

export interface IRemove extends IActivity {
	type: 'Remove';
}

export interface ILike extends IActivity {
	type: 'Like';
	_misskey_reaction: string;
}

export interface IAnnounce extends IActivity {
	type: 'Announce';
}

export interface IBlock extends IActivity {
	type: 'Block';
}

export type Object =
	ICollection |
	IOrderedCollection |
	ICollectionPage |
	IOrderedCollectionPage |
	ICreate |
	IDelete |
	IUndo |
	IFollow |
	IAccept |
	IReject |
	IAdd |
	IRemove |
	ILike |
	IAnnounce |
	IBlock;
