import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.roomGroupName = "group_chat_gfg"
		await self.channel_layer.group_add(
			self.roomGroupName ,
			self.channel_name
		)
		await self.accept()

	async def disconnect(self , close_code):
		await self.channel_layer.group_discard(
			self.roomGroupName , 
			self.channel_layer 
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		chat_id = text_data_json["chat_id"]
		sender_id = text_data_json["sender_id"]
		content = text_data_json["content"]
		timestamp = text_data_json["timestamp"]
		
		await self.channel_layer.group_send(
			self.roomGroupName,{
				"type": "sendMessage",
				"chat_id":chat_id,
				"sender_id":sender_id,
				"content":content,
				"timestamp":timestamp,
			})
		
	async def sendMessage(self , event) : 
		chat_id = event["chat_id"]
		sender_id = event["sender_id"]
		content = event["content"]
		timestamp = event["timestamp"]

		await self.send(text_data = json.dumps({
			"chat_id":chat_id,
			"sender_id":sender_id,
			"content":content,
			"timestamp":timestamp,
			}))