<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import { Button, Modal } from 'flowbite-svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'	 	
	
	let placement;
  	let open = false;
	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	const setPlacement = (ev) => {
   	 	placement = ev.target.textContent; // text in the button
    	open = !open
  	};

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	const handleSubmit = async () => {
		
		loading = true
		chatMessages = [...chatMessages, { role: 'user', content: query }]

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

		query = ''
		
		eventSource.addEventListener('error', handleError)

		eventSource.addEventListener('message', (e) => {
			scrollToBottom()
			try {
				loading = false
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }]
					answer = ''
					return
				}

				const completionResponse = JSON.parse(e.data)
				const [{ delta }] = completionResponse.choices

				if (delta.content) {
					answer = (answer ?? '') + delta.content
				}
			} catch (err) {
				handleError(err)
			}
		})
		eventSource.stream()
		scrollToBottom()
	}

	function handleError<T>(err: T) {
		loading = false
		query = ''
		answer = ''
		console.error(err)
	}
	
</script>

<div class="flex flex-col pt-4 w-full px-8 items-center gap-2">
	<div>
		<h1 class="text-2xl font-bold w-full text-center">Business Chatbot Example</h1>
		<p class="text-sm italic">Uses Attention Language Model(Generative Model)</p>
	</div>

	<div class="inline-grid grid-cols-3 grid-rows-3 gap-4">
		<Button on:click={setPlacement}>top-left</Button>
		<Button on:click={setPlacement}>top-center</Button>
		<Button on:click={setPlacement}>top-right</Button>
		<Button on:click={setPlacement}>center-left</Button>
		<Button on:click={setPlacement}>center</Button>
		<Button on:click={setPlacement}>center-right</Button>
		<Button on:click={setPlacement}>bottom-left</Button>
		<Button on:click={setPlacement}>bottom-center</Button>
		<Button on:click={setPlacement}>bottom-right</Button>
	</div>
	  
	<Modal title="AI Asset" bind:open {placement}
	styleBg={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
	styleWindow={{ boxShadow: '100 45px 55px 100 rgba(0, 0, 0, 0.15)' }}
	
	>
		<div class="h-[500px] w-full bg-black rounded-md p-4 overflow-y-auto flex flex-col gap-4 tester">
			<div class="flex flex-col gap-2">
				<ChatMessage type="assistant" message="Hello, Im qualified to assist in just about anything concerning technology." />
				{#each chatMessages as message}
					<ChatMessage type={message.role} message={message.content} />
				{/each}
				{#if answer}
					<ChatMessage type="assistant" message={answer} />
				{/if}
				{#if loading}
					<ChatMessage type="assistant" message="Loading.." />
				{/if}
			</div>
			<div class="" bind:this={scrollToDiv} />
		</div>
		<svelte:fragment slot='footer'>
		<form
			class="flex w-full rounded-md gap-4 bg-gray-900 p-4"
			on:submit|preventDefault={() => handleSubmit()}
		>
			<input type="text" class="input input-bordered w-full" bind:value={query} />
			<Button type="submit" gradient color="blue"> Send </Button>
		</form>
		</svelte:fragment>
	</Modal>
	  


	
	
</div>
