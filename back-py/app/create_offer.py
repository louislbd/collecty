from pydantic import BaseModel
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.transactions import NFTokenCreateOffer, NFTokenCancelOffer, NFTokenAcceptOffer
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.models.requests import NFTSellOffers, NFTBuyOffers
from typing import Any

class NFTOffer(BaseModel):
    account: str
    nft_id: str
    price: float
    is_sell_offer: bool

async def get_offer_response(result: dict[str, Any]) -> dict[str, Any]:
    print("get_offer_response: ", result)
    # tx_json = result["tx_json"]
    # return {
    #     "nft": {
    #         "id": result["meta"]["nftoken_id"],
    #         "issuer": tx_json["Account"],
    #         "owner": tx_json["Account"],
    #         "uri": hex_to_str(tx_json["URI"]),
    #         "flags": tx_json["Flags"],
    #         "transfer_fee": tx_json["TransferFee"],
    #         "taxon": tx_json["NFTokenTaxon"],
    #     },
    #     "fee": int(tx_json["Fee"]),
    #     "raw_result": result
    # }

def parse_result(result) -> NFTOffer:
    """
    Parses the transaction response to extract relevant details.
    """
    tx_json = result.get("tx_json")
    is_sell_offer = bool(tx_json.get("Flags", 0) & 1)
    amount_in_xrp = int(tx_json.get("Amount", 0)) / (10**6)

    return NFTOffer(
        account=tx_json.get("Account"),
        nft_id=tx_json.get("NFTokenID"),
        price=amount_in_xrp,
        is_sell_offer=is_sell_offer
    )

async def xrpl_create_offer(
    wallet_seed: str,
    nft_id: str,
    amount: float,
    is_sell_offer: bool,
    owner: str = None,
    destination: str = None,
    expiration: int = None
):
    """
    Create an NFT offer on the XRPL ledger.
    """
    try:
        client = AsyncJsonRpcClient("https://s.altnet.rippletest.net:51234")
        wallet = Wallet.from_seed(wallet_seed)

        tx = NFTokenCreateOffer(
            account=wallet.classic_address,
            nftoken_id=nft_id,
            amount=str(int(amount * (10**6))),
            flags=1 if is_sell_offer else 0,
            owner=owner,
            destination=destination,
            expiration=expiration
        )

        print("tx", tx)
        tx_response = await submit_and_wait(tx, client, wallet)
        print("tx_response", tx_response)
        return parse_result(tx_response.result)
    except Exception as e:
        return {"Error creating NFT Offer": {str(e)}}

async def xrpl_check_nft_offers(nft_id: str, is_sell_offer: bool):
    """
    Check NFT offers on the XRPL ledger.
    """
    try:
        client = AsyncJsonRpcClient("https://s.altnet.rippletest.net:51234")
        request = NFTSellOffers(nft_id=nft_id) if is_sell_offer else NFTBuyOffers(nft_id=nft_id)
        response = client.request(request)
        return parse_result(response.result)
    except Exception as e:
        return {"An error occured while checking for NFT Offers": {str(e)}}

async def xrpl_cancel_nft_offer(wallet_seed: str, offer_id: str):
    """
    Cancel an existing NFT offer on the XRPL ledger.
    """
    try:
        client = AsyncJsonRpcClient("https://s.altnet.rippletest.net:51234")
        wallet = Wallet.from_seed(wallet_seed)

        tx = NFTokenCancelOffer(
            account=wallet.classic_address,
            nftoken_offers=[offer_id]
        )

        tx_response = await submit_and_wait(tx, client, wallet)
        return tx_response
    except Exception as e:
        return {"An error occured while canceling NFT Offer": {str(e)}}

async def xrpl_buy_nft_offer(wallet_seed: str, offer_id: str):
    """
    Buy an existing NFT offer on the XRPL ledger.

    :param wallet_seed: Wallet seed to sign the transaction.
    :param offer_id: ID of the NFT offer to buy.
    :return: Transaction result.
    """
    try:
        client = AsyncJsonRpcClient("https://s.altnet.rippletest.net:51234")
        wallet = Wallet.from_seed(wallet_seed)

        tx = NFTokenAcceptOffer(
            account=wallet.classic_address,
            nftoken_offers=[offer_id]
        )

        tx_response = await submit_and_wait(tx, client, wallet)
        return tx_response
    except Exception as e:
        return {"An error occured while accepting NFT Offer": {str(e)}}

