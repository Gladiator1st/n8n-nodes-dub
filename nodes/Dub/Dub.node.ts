import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Dub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dub.co',
		name: 'dub',
		icon: { light: 'file:dub.svg', dark: 'file:dub.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create branded short links, generate QR codes, and track click analytics with Dub.co',
		usableAsTool: true,
		defaults: {
			name: 'Dub.co',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'dubApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Get real-time click and conversion analytics for links',
					},
					{
						name: 'Domain',
						value: 'domain',
						description: 'View custom domains in your workspace',
					},
					{
						name: 'Link',
						value: 'link',
						description: 'Create, update, retrieve, and delete short links',
					},
					{
						name: 'QR Code',
						value: 'qrCode',
						description: 'Generate customizable high-resolution QR codes',
					},
					{
						name: 'Tag',
						value: 'tag',
						description: 'Organize and categorize links with tags',
					},
				],
				default: 'link',
			},

			// =========================================================================
			//                               LINK OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['link'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new short link',
						action: 'Create a link',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a short link by ID',
						action: 'Delete a link',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get details of a specific short link',
						action: 'Get a link',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many short links',
						action: 'List many links',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing short link',
						action: 'Update a link',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Destination URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['link'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'https://example.com/my-long-landing-page-url',
				description: 'The destination URL where the short link will redirect',
			},
			{
				displayName: 'Short Key / Slug',
				name: 'key',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['link'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-custom-slug (leave blank for random)',
				description: 'Custom slug for the short link. If left empty, Dub generates a random slug.',
			},
			{
				displayName: 'Custom Domain',
				name: 'domain',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['link'],
						operation: ['create', 'getAll'],
					},
				},
				default: 'dub.sh',
				placeholder: 'dub.sh or custom domain',
				description: 'The domain to use for the short link (e.g. dub.sh or your custom domain)',
			},
			{
				displayName: 'Link ID',
				name: 'linkId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['link'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The unique ID of the link (e.g. clk_...)',
			},
			{
				displayName: 'New Destination URL',
				name: 'updateUrl',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['link'],
						operation: ['update'],
					},
				},
				default: '',
				placeholder: 'https://example.com/new-target-url',
				description: 'The updated destination URL for the link',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['link', 'tag', 'domain'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['link', 'tag', 'domain'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// =========================================================================
			//                             QR CODE OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['qrCode'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate a customized QR code image for a URL',
						action: 'Generate a QR code',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'QR Code URL',
				name: 'qrUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['qrCode'],
						operation: ['generate'],
					},
				},
				default: '',
				placeholder: 'https://dub.sh/my-link',
				description: 'The URL to encode inside the QR code',
			},
			{
				displayName: 'Size (Pixels)',
				name: 'qrSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['qrCode'],
						operation: ['generate'],
					},
				},
				default: 600,
				description: 'The pixel size (width and height) of the QR code image',
			},

			// =========================================================================
			//                            ANALYTICS OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['analytics'],
					},
				},
				options: [
					{
						name: 'Get Clicks Analytics',
						value: 'get',
						description: 'Retrieve real-time click counts and analytics for links',
						action: 'Get click analytics',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Event Type',
				name: 'analyticsEvent',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['get'],
					},
				},
				options: [
					{
						name: 'Clicks',
						value: 'clicks',
					},
					{
						name: 'Leads',
						value: 'leads',
					},
					{
						name: 'Sales',
						value: 'sales',
					},
				],
				default: 'clicks',
				description: 'The type of analytics event to retrieve',
			},
			{
				displayName: 'Group By',
				name: 'analyticsGroupBy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['get'],
					},
				},
				options: [
					{
						name: 'Count (Total)',
						value: 'count',
					},
					{
						name: 'Timeseries (Hourly/Daily)',
						value: 'timeseries',
					},
					{
						name: 'Countries',
						value: 'countries',
					},
					{
						name: 'Cities',
						value: 'cities',
					},
					{
						name: 'Devices',
						value: 'devices',
					},
					{
						name: 'Browsers',
						value: 'browsers',
					},
					{
						name: 'Referrers',
						value: 'referrers',
					},
				],
				default: 'count',
				description: 'How to group the analytics report',
			},
			{
				displayName: 'Interval',
				name: 'analyticsInterval',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['get'],
					},
				},
				options: [
					{
						name: 'Last 24 Hours',
						value: '24h',
					},
					{
						name: 'Last 7 Days',
						value: '7d',
					},
					{
						name: 'Last 30 Days',
						value: '30d',
					},
					{
						name: 'All Time',
						value: 'all',
					},
				],
				default: '7d',
				description: 'Time interval window for analytics data',
			},
			{
				displayName: 'Filter by Link ID',
				name: 'analyticsLinkId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: 'clk_...',
				description: 'Optional link ID to filter analytics for a single link',
			},

			// =========================================================================
			//                                TAG OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tag'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new tag for organizing links',
						action: 'Create a tag',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many tags in the workspace',
						action: 'List many tags',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Tag Name',
				name: 'tagName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'marketing-q3',
				description: 'The name of the tag to create',
			},
			{
				displayName: 'Tag Color',
				name: 'tagColor',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'Red', value: 'red' },
					{ name: 'Yellow', value: 'yellow' },
					{ name: 'Green', value: 'green' },
					{ name: 'Blue', value: 'blue' },
					{ name: 'Purple', value: 'purple' },
					{ name: 'Pink', value: 'pink' },
					{ name: 'Brown', value: 'brown' },
				],
				default: 'blue',
				description: 'Color theme of the tag',
			},

			// =========================================================================
			//                              DOMAIN OPERATIONS
			// =========================================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['domain'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List many custom domains in your workspace',
						action: 'List many domains',
					},
				],
				default: 'getAll',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let endpoint = '';
				let method = 'GET';
				let body: IDataObject | undefined = undefined;
				let qs: IDataObject = {};

				// =========================================================================
				//                              LINK ROUTING
				// =========================================================================
				if (resource === 'link') {
					if (operation === 'create') {
						endpoint = '/links';
						method = 'POST';
						const url = this.getNodeParameter('url', i) as string;
						const key = this.getNodeParameter('key', i, '') as string;
						const domain = this.getNodeParameter('domain', i, 'dub.sh') as string;

						body = {
							url,
							domain: domain || 'dub.sh',
						};
						if (key) {
							body.key = key;
						}
					} else if (operation === 'get') {
						endpoint = '/links/info';
						method = 'GET';
						const linkId = this.getNodeParameter('linkId', i) as string;
						qs = { linkId };
					} else if (operation === 'getAll') {
						endpoint = '/links';
						method = 'GET';
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const domain = this.getNodeParameter('domain', i, '') as string;
						if (domain) {
							qs.domain = domain;
						}
						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i, 50) as number;
							qs.pageSize = limit;
						}
					} else if (operation === 'update') {
						const linkId = this.getNodeParameter('linkId', i) as string;
						endpoint = `/links/${linkId}`;
						method = 'PATCH';
						const updateUrl = this.getNodeParameter('updateUrl', i, '') as string;
						body = {};
						if (updateUrl) {
							body.url = updateUrl;
						}
					} else if (operation === 'delete') {
						const linkId = this.getNodeParameter('linkId', i) as string;
						endpoint = `/links/${linkId}`;
						method = 'DELETE';
					}
				}

				// =========================================================================
				//                            QR CODE ROUTING
				// =========================================================================
				else if (resource === 'qrCode') {
					if (operation === 'generate') {
						endpoint = '/qr';
						method = 'GET';
						const qrUrl = this.getNodeParameter('qrUrl', i) as string;
						const qrSize = this.getNodeParameter('qrSize', i, 600) as number;
						qs = {
							url: qrUrl,
							size: qrSize,
						};
					}
				}

				// =========================================================================
				//                           ANALYTICS ROUTING
				// =========================================================================
				else if (resource === 'analytics') {
					if (operation === 'get') {
						endpoint = '/analytics';
						method = 'GET';
						const event = this.getNodeParameter('analyticsEvent', i, 'clicks') as string;
						const groupBy = this.getNodeParameter('analyticsGroupBy', i, 'count') as string;
						const interval = this.getNodeParameter('analyticsInterval', i, '7d') as string;
						const linkId = this.getNodeParameter('analyticsLinkId', i, '') as string;

						qs = {
							event,
							groupBy,
							interval,
						};
						if (linkId) {
							qs.linkId = linkId;
						}
					}
				}

				// =========================================================================
				//                              TAG ROUTING
				// =========================================================================
				else if (resource === 'tag') {
					if (operation === 'create') {
						endpoint = '/tags';
						method = 'POST';
						const tag = this.getNodeParameter('tagName', i) as string;
						const color = this.getNodeParameter('tagColor', i, 'blue') as string;
						body = { tag, color };
					} else if (operation === 'getAll') {
						endpoint = '/tags';
						method = 'GET';
					}
				}

				// =========================================================================
				//                            DOMAIN ROUTING
				// =========================================================================
				else if (resource === 'domain') {
					if (operation === 'getAll') {
						endpoint = '/domains';
						method = 'GET';
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: "${resource}"`);
				}

				const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'dubApi', {
					method,
					url: `https://api.dub.co${endpoint}`,
					body,
					qs,
					json: true,
				})) as IDataObject | IDataObject[];

				if (Array.isArray(response)) {
					for (const entry of response) {
						returnData.push({
							json: entry,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: response || { success: true },
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
