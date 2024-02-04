'use client'

import rsa from 'jsrsasign'

export default function Interac() {
    const cfg = {
        authUrl: 'https://gateway-devportal2.pp.vids.dev/auth',
        callbackUrl: 'http://localhost:3000/interac-callback',
        kid: 'interac.poc.key',
        clientIds: [
            '09ee2e7c-a1df-4ad8-9468-ff5fa543b978',
            'be5b04e7-66b6-46b2-a3f6-41c978027e23',
            '39f1d587-6c40-41b0-a1b9-00ea5910e745',
            ],
        issuer: 'https://gateway-devportal2.pp.vids.dev/',
        audience: 'https://gateway-devportal2.pp.vids.dev/',
        privateKey: `-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAxtqqvU1ZTj+lJEYT
b54xMaDSc5s9Ak2e/bJqtOOUqiEaW9WvtM8OMIPBoOvE/HLsMl+CQlTMlHQBiuW3
Di9BqQIDAQABAkAsiVDwMOCti8eaxi8YMp/l85Tu23fgii3vuAP6G3ZyW65czb5g
Wuvp38cwOlrEKiHKYb6+OoOArcmzYfJuO2g5AiEA8GLQ5oq6D4lKAi2/qVeXOYFd
TnqRtIpW4UwEFAaO2DcCIQDTxUBy1FGvWi0jCc0kN0cZ1DZ4kX+aBkEVM9R0Y6YF
HwIgcgDbQ8rdDMs2fywFLqGsxYf1oWd9vJqzM2wirwChNCcCIHy0vsQgNc4eO1BT
2EMIbk1Og5kyjULlhfP3Zpf3im+fAiEAqKBsaw1zJCWWrV9aNHDJCZAHJAOYwHYP
Z7In/rUwMco=
-----END PRIVATE KEY-----`,
    }

    function uuid(): string {
        return rsa.KJUR.crypto.Util.getRandomHexOfNbytes(16);
    }
    function sign(headerObj, payloadObj): string {
        const hJson = JSON.stringify(headerObj);
        const pJson = JSON.stringify(payloadObj);
        const jwt = rsa.KJUR.jws.JWS.sign("RS256", hJson, pJson, cfg.privateKey);
        return jwt;
    }

    function handleClickType1() {
        handleClick(1);
    }

    function handleClickType2() {
        handleClick(2);
    }

    function handleClickType3() {
        handleClick(3);
    }

    function handleClick(type: number) {
        const header = {
            alg: "RS256",
            kid: cfg.kid,
        };
        const state = uuid();
        const callbackQueryParam = type < 2 ? '' : (`?type=${type}`);
        const callbackUrl = cfg.callbackUrl + callbackQueryParam;
        const clientId = cfg.clientIds[type - 1];
        const payload = {
            aud: cfg.audience,
            client_id: clientId,
            iss: clientId,
            nonce: uuid(),
            redirect_uri: callbackUrl,
            response_type: "code",
            scope: "openid general_scope",
            state: state,
            ui_local: "en-CA",
        }
        const jwt = sign(header, payload);
        const callbackUrlEncoded = encodeURIComponent(callbackUrl);
        const url = `${cfg.authUrl}?request=${jwt}&response_type=code&client_id=${clientId}&scope=openid+general_scope&state=${state}&redirect_uri=${callbackUrlEncoded}`;
        alert('redirect to URL = ' + url);
        window.open(url, '_self');
    }
    return (
        <div>
            <div style={{margin: "60px"}}>
                <button onClick={handleClickType1}>
                    Start To Call Interac IVS + IDVS (Interac Verification Serivce + Interac Document Verification Service)
                </button>
            </div>
            <div style={{margin: "60px"}}>
                <button onClick={handleClickType2}>
                    Start To Call Interac IVS
                </button>
            </div>
            <div style={{margin: "60px"}}>
                <button onClick={handleClickType3}>
                    Start To Call Interac IDVS
                </button>
            </div>
        </div>
    );
}