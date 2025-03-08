from typing import Union
from pydantic import BaseModel
from fastapi import (
    FastAPI,
    APIRouter,
)
from app.create_offer import (
    xrpl_create_offer,
    xrpl_check_nft_offers,
    xrpl_cancel_nft_offer,
    xrpl_buy_nft_offer
)
from app.create_nft import create_xrpl_nft

collecty_app = FastAPI()
router = APIRouter()

@collecty_app.get("/")
def read_root():
    return {"Hello": "World"}


class NFTCreateRequest(BaseModel):
    uri: str
    client_wallet_seed: str


@collecty_app.post("/nft/create")
async def create_nft(request: NFTCreateRequest):
    result = await create_xrpl_nft(
        request.uri,
        request.client_wallet_seed,
    )
    return result

class NFTOfferRequest(BaseModel):
    wallet_seed: str
    nft_id: str
    amount: float
    is_sell_offer: bool
    owner: str = None
    destination: str = None
    expiration: int = None

@collecty_app.post("/nft/offer/create")
async def create_offer(request: NFTOfferRequest):
    result = await xrpl_create_offer(
        request.wallet_seed,
        request.nft_id,
        request.amount,
        request.is_sell_offer,
        request.owner,
        request.destination,
        request.expiration
    )
    return result

class NFTCheckRequest(BaseModel):
    nft_id: str
    is_sell_offer: bool

@collecty_app.post("/nft/offer/check")
async def check_nft_offers(request: NFTCheckRequest):
    result = await xrpl_check_nft_offers(
        request.nft_id,
        request.is_sell_offer
    )
    return result

class NFTCancelRequest(BaseModel):
    wallet_seed: str
    offer_id: str

@collecty_app.post("/nft/offer/cancel")
async def cancel_offer(request: NFTCancelRequest):
    result = await xrpl_cancel_nft_offer(
        request.wallet_seed,
        request.offer_id
    )
    return result

class NFTBuyRequest(BaseModel):
    wallet_seed: str
    offer_id: str

@collecty_app.post("/nft/offer/buy")
async def buy_offer(request: NFTBuyRequest):
    result = await xrpl_buy_nft_offer(
        request.wallet_seed,
        request.offer_id
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
            "main:collecty_app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            workers=1,
            loop="asyncio"
    )