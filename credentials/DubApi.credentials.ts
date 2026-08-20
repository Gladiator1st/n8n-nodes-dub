import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DubApi implements ICredentialType {
	name = 'dubApi';
	displayName = 'Dub.co API';
	icon = { light: 'file:dub.svg', dark: 'file:dub.dark.svg' } as const;
	documentationUrl = 'https://dub.co/docs/api-reference/introduction';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key from your Dub.co workspace settings',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.dub.co',
			url: '/workspaces',
			method: 'GET',
		},
	};
}
