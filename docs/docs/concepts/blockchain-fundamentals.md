# GIWA 블록체인과 SDK 이해하기

이 문서는 블록체인 기초 이론부터 GIWA 체인의 기술 아키텍처, 그리고 본 SDK를 개발하게 된 배경까지 상세하게 설명합니다.

---

## 목차

1. [블록체인 기초 이론](#1-블록체인-기초-이론)
2. [이더리움과 스마트 컨트랙트](#2-이더리움과-스마트-컨트랙트)
3. [Layer 2 스케일링 솔루션](#3-layer-2-스케일링-솔루션)
4. [OP Stack과 Optimistic Rollup](#4-op-stack과-optimistic-rollup)
5. [GIWA 체인 이해하기](#5-giwa-체인-이해하기)
6. [Flashblocks: 초고속 트랜잭션 확인](#6-flashblocks-초고속-트랜잭션-확인)
7. [GIWA React Native SDK 개발 배경](#7-giwa-react-native-sdk-개발-배경)
8. [참고 자료](#8-참고-자료)

---

## 1. 블록체인 기초 이론

### 1.1 블록체인이란?

블록체인은 **분산 원장 기술(Distributed Ledger Technology, DLT)**의 한 형태로, 데이터를 중앙 서버가 아닌 네트워크 참여자들이 공동으로 기록하고 관리하는 시스템입니다.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Block 1   │───▶│   Block 2   │───▶│   Block 3   │───▶│   Block N   │
│             │    │             │    │             │    │             │
│ - Hash      │    │ - Hash      │    │ - Hash      │    │ - Hash      │
│ - Prev Hash │    │ - Prev Hash │    │ - Prev Hash │    │ - Prev Hash │
│ - Txs       │    │ - Txs       │    │ - Txs       │    │ - Txs       │
│ - Timestamp │    │ - Timestamp │    │ - Timestamp │    │ - Timestamp │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 1.2 핵심 특성

| 특성 | 설명 |
|------|------|
| **탈중앙화 (Decentralization)** | 단일 기관이 아닌 네트워크 참여자들이 공동으로 데이터를 관리 |
| **불변성 (Immutability)** | 한번 기록된 데이터는 수정하거나 삭제할 수 없음 |
| **투명성 (Transparency)** | 모든 거래 내역이 공개되어 누구나 검증 가능 |
| **합의 메커니즘 (Consensus)** | 네트워크 참여자들이 데이터의 유효성에 동의하는 방식 |

### 1.3 합의 메커니즘 (Consensus Mechanism)

블록체인 네트워크에서 새로운 블록을 생성하고 거래를 검증하는 방식입니다.

#### Proof of Work (PoW)
- 비트코인이 사용하는 방식
- 복잡한 수학 문제를 풀어 블록 생성 권한 획득
- 높은 에너지 소비가 단점

#### Proof of Stake (PoS)
- 이더리움 2.0이 사용하는 방식
- 보유한 암호화폐를 담보로 블록 생성 권한 획득
- 에너지 효율적이지만 "부자가 더 부자가 되는" 구조 우려

### 1.4 트랜잭션 (Transaction)

블록체인에서 발생하는 모든 상태 변경을 기록하는 단위입니다.

```typescript
interface Transaction {
  from: string;      // 발신자 주소
  to: string;        // 수신자 주소
  value: bigint;     // 전송 금액 (wei 단위)
  data: string;      // 스마트 컨트랙트 호출 데이터
  nonce: number;     // 발신자의 트랜잭션 순서 번호
  gasLimit: bigint;  // 최대 가스 사용량
  gasPrice: bigint;  // 가스 당 가격
}
```

---

## 2. 이더리움과 스마트 컨트랙트

### 2.1 이더리움 (Ethereum)

이더리움은 2015년 비탈릭 부테린(Vitalik Buterin)이 창시한 **프로그래밍 가능한 블록체인** 플랫폼입니다. 단순한 가치 전송을 넘어 **스마트 컨트랙트**를 통해 복잡한 비즈니스 로직을 블록체인 위에서 실행할 수 있습니다.

### 2.2 이더리움 가상 머신 (EVM)

EVM(Ethereum Virtual Machine)은 스마트 컨트랙트를 실행하는 가상 컴퓨터입니다.

```
┌─────────────────────────────────────────────────────────────┐
│                     Ethereum Network                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                         EVM                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ Smart       │  │ Smart       │  │ Smart       │   │   │
│  │  │ Contract A  │  │ Contract B  │  │ Contract C  │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    World State                          │ │
│  │  Account 0x1234... : Balance: 10 ETH, Nonce: 5         │ │
│  │  Account 0x5678... : Balance: 25 ETH, Nonce: 12        │ │
│  │  Contract 0xABCD... : Code: 0x6080..., Storage: {...}  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 스마트 컨트랙트 (Smart Contract)

스마트 컨트랙트는 **자동으로 실행되는 프로그램**으로, 특정 조건이 충족되면 미리 정의된 동작을 수행합니다.

```solidity
// Solidity 스마트 컨트랙트 예시
contract SimpleToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
```

### 2.4 가스 (Gas)

가스는 이더리움에서 연산을 수행하는 데 필요한 비용 단위입니다.

| 연산 | 가스 비용 |
|------|----------|
| 덧셈/뺄셈 | 3 gas |
| 곱셈/나눗셈 | 5 gas |
| 스토리지 읽기 | 200 gas |
| 스토리지 쓰기 | 20,000 gas |
| 컨트랙트 배포 | 32,000+ gas |

```
트랜잭션 비용 = Gas Used × Gas Price

예시: 21,000 gas × 20 Gwei = 0.00042 ETH
```

### 2.5 이더리움의 한계: 확장성 문제

이더리움 메인넷(Layer 1)은 다음과 같은 한계를 가지고 있습니다:

| 문제 | 설명 |
|------|------|
| **낮은 TPS** | 초당 약 15-30개의 트랜잭션만 처리 가능 |
| **높은 가스비** | 네트워크 혼잡 시 수십~수백 달러의 가스비 발생 |
| **긴 확정 시간** | 블록 생성에 약 12초, 최종 확정까지 수 분 소요 |

이러한 문제를 해결하기 위해 **Layer 2 솔루션**이 등장했습니다.

---

## 3. Layer 2 스케일링 솔루션

### 3.1 Layer 1 vs Layer 2

```
┌─────────────────────────────────────────────────────────────────┐
│                        Layer 2 (L2)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   GIWA       │  │   Base       │  │   Arbitrum   │  ...      │
│  │   Chain      │  │              │  │   One        │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
│         ▼                 ▼                 ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Data Availability & Settlement                 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Layer 1 (Ethereum)                           │
│                                                                  │
│  - 최종 보안 제공 (Security)                                      │
│  - 데이터 가용성 (Data Availability)                              │
│  - 분쟁 해결 (Dispute Resolution)                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Layer 2의 유형

#### Optimistic Rollup
- **원리**: 트랜잭션이 유효하다고 "낙관적으로" 가정하고 처리
- **분쟁 기간**: 약 7일간 누구나 부정 거래에 이의 제기 가능
- **대표 프로젝트**: Optimism, Arbitrum, Base, **GIWA**
- **장점**: EVM 호환성 우수, 개발 편의성

#### ZK (Zero-Knowledge) Rollup
- **원리**: 암호학적 증명으로 트랜잭션 유효성 즉시 증명
- **대표 프로젝트**: zkSync, StarkNet, Polygon zkEVM
- **장점**: 빠른 최종성, 높은 보안성
- **단점**: EVM 호환성 제한, 복잡한 개발

### 3.3 Rollup의 동작 방식

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 2 Rollup                            │
│                                                              │
│  1. 사용자 트랜잭션 수집                                       │
│     ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                         │
│     │ Tx1 │ │ Tx2 │ │ Tx3 │ │ Tx4 │  ...                    │
│     └─────┘ └─────┘ └─────┘ └─────┘                         │
│                      │                                       │
│                      ▼                                       │
│  2. 트랜잭션 배치 (Batch) 생성                                 │
│     ┌─────────────────────────────────────┐                 │
│     │ Batch: [Tx1, Tx2, Tx3, Tx4, ...]    │                 │
│     │ State Root: 0xabc123...             │                 │
│     └─────────────────────────────────────┘                 │
│                      │                                       │
│                      ▼                                       │
│  3. L1에 압축된 데이터 제출                                    │
│     ┌─────────────────────────────────────┐                 │
│     │ Compressed Calldata + State Root    │                 │
│     └─────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Layer 1 (Ethereum)                        │
│                                                              │
│  - 배치 데이터 저장                                            │
│  - State Root 검증 (Optimistic: 7일 대기)                     │
│  - 최종 확정 (Finality)                                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Layer 2의 장점

| 항목 | Layer 1 (Ethereum) | Layer 2 (GIWA) |
|------|-------------------|----------------|
| TPS | ~15-30 | ~2,000+ |
| 가스비 | $5-100+ | $0.001-0.01 |
| 블록 시간 | ~12초 | ~1초 |
| 최종성 | 수 분 | 수 초 (Flashblocks: 200ms) |

---

## 4. OP Stack과 Optimistic Rollup

### 4.1 OP Stack이란?

OP Stack은 Optimism에서 개발한 **모듈화된 오픈소스 블록체인 개발 프레임워크**입니다. 누구나 OP Stack을 사용하여 자체 Layer 2 체인을 구축할 수 있습니다.

### 4.2 OP Stack 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         OP Stack                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Sequencer                                ││
│  │  - 트랜잭션 순서 결정                                         ││
│  │  - 블록 생성                                                  ││
│  │  - L1에 배치 제출                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Execution Engine                         ││
│  │  - EVM 호환 실행 환경                                         ││
│  │  - op-geth (Geth 포크)                                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Derivation Pipeline                       ││
│  │  - L1 데이터로부터 L2 상태 재구성                              ││
│  │  - op-node                                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Bridge (Standard Bridge)                  ││
│  │  - L1 ↔ L2 자산 이동                                         ││
│  │  - 네이티브 브릿지                                            ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 OP Stack 기반 주요 체인들

| 체인 | 개발사 | 특징 |
|------|--------|------|
| **OP Mainnet** | Optimism | OP Stack의 원조 |
| **Base** | Coinbase | 1억+ 사용자 기반 |
| **GIWA** | Upbit | 한국 최대 거래소 연계 |
| **Zora** | Zora | NFT 특화 |
| **Mode** | Mode Network | DeFi 특화 |
| **Worldchain** | World (Worldcoin) | 신원 인증 특화 |

### 4.4 Superchain 비전

Superchain은 OP Stack 기반 체인들이 서로 상호운용 가능한 네트워크를 형성하는 비전입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Superchain                                │
│                                                                  │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│   │  GIWA   │  │  Base   │  │  Zora   │  │  Mode   │  ...       │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
│        │            │            │            │                  │
│        └────────────┴────────────┴────────────┘                  │
│                         │                                        │
│                         ▼                                        │
│              ┌─────────────────────┐                             │
│              │ Cross-Chain Messaging │                           │
│              │ Shared Sequencing     │                           │
│              │ Unified Liquidity     │                           │
│              └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. GIWA 체인 이해하기

### 5.1 GIWA란?

**GIWA(기와)**는 OP Stack 기반의 이더리움 Layer 2 블록체인으로, Web3 진입 장벽을 낮추고 누구나 쉽게 사용할 수 있는 인프라를 제공합니다.

"기와(GIWA)"라는 이름은 한국 전통 지붕 기와에서 유래했습니다. 개별적으로는 작은 조각이지만, 함께 모이면 견고한 구조물을 이루는 것처럼, 많은 빌더와 아이디어가 모여 견고한 Web3 생태계를 형성한다는 의미를 담고 있습니다.

### 5.2 GIWA의 핵심 가치

| 가치 | 설명 |
|------|------|
| **접근성** | Web3가 어렵게 느껴지는 장벽을 허물고, 누구나 쉽게 사용할 수 있는 인프라 제공 |
| **개방성** | 특정 주체에 종속되지 않은 오픈형 Layer 2로, 전 세계에서 사용 가능 |
| **빌더 친화적** | 한국어와 영어 문서 제공, 개발자 온보딩 지원 |
| **기관 연계** | 업비트(Upbit)와의 연결로 사용자, 데이터, 풍부한 유동성을 Web3 생태계로 연결 |

### 5.3 기술 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                       GIWA Chain                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     Applications                             ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         ││
│  │  │ DeFi    │  │ NFT     │  │ Gaming  │  │ Social  │  ...    ││
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    GIWA Features                             ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          ││
│  │  │ GIWA ID     │  │ Dojang      │  │ Flashblocks │          ││
│  │  │ (ENS-based) │  │ (EAS-based) │  │ (~200ms)    │          ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    OP Stack (Bedrock)                        ││
│  │  - Sequencer      - Execution Engine (op-geth)              ││
│  │  - Derivation     - Standard Bridge                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum Sepolia (Testnet)                    │
│                    Ethereum Mainnet (Mainnet)                    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 GIWA의 기술적 특징

| 특징 | 설명 |
|------|------|
| **빠른 블록 생성** | 1초마다 새 블록 생성 (이더리움: 12초) |
| **EVM 호환** | 기존 Solidity 스마트 컨트랙트 수정 없이 배포 가능 |
| **저렴한 수수료** | 이더리움 대비 약 90% 이상 저렴한 가스비 |
| **Flashblocks** | ~200ms의 사전 확인(preconfirmation) 제공 |
| **GIWA ID** | ENS 기반 사람이 읽을 수 있는 주소 체계 |
| **Dojang** | EAS 기반 증명(Attestation) 시스템 |

### 5.5 네트워크 정보

#### Testnet (GIWA Sepolia)

| 항목 | 값 |
|------|-----|
| Chain ID | `91342` |
| Network Name | GIWA Sepolia |
| RPC URL | `https://sepolia-rpc.giwa.io` |
| Flashblocks RPC | `https://sepolia-rpc-flashblocks.giwa.io` |
| Flashblocks WebSocket | `wss://sepolia-rpc-flashblocks.giwa.io` |
| Block Explorer | `https://sepolia-explorer.giwa.io` |
| Currency | ETH |
| Base Layer | Ethereum Sepolia |

#### Mainnet (예정)

| 항목 | 값 |
|------|-----|
| Chain ID | `91341` (예정) |
| Network Name | GIWA Mainnet |
| RPC URL | `https://rpc.giwa.io` |
| Block Explorer | `https://explorer.giwa.io` |
| Currency | ETH |
| Base Layer | Ethereum Mainnet |

---

## 6. Flashblocks: 초고속 트랜잭션 확인

### 6.1 Flashblocks란?

Flashblocks는 Flashbots에서 개발한 **스트리밍 블록 구성 레이어**로, 표준 2초 블록 시간을 기다리지 않고 **약 200-250ms마다** 사전 확인(preconfirmation)을 제공합니다.

### 6.2 동작 원리

```
┌─────────────────────────────────────────────────────────────────┐
│                    Standard Block (2초)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Full Block                          │   │
│  │                                                          │   │
│  │  Flashblock 1  Flashblock 2  Flashblock 3  Flashblock 4  │   │
│  │  (0-250ms)     (250-500ms)   (500-750ms)   (750-1000ms)  │   │
│  │                                                          │   │
│  │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   │   │
│  │  │ Tx1,Tx2 │   │ Tx3,Tx4 │   │ Tx5,Tx6 │   │ Tx7,Tx8 │   │   │
│  │  └─────────┘   └─────────┘   └─────────┘   └─────────┘   │   │
│  │       │             │             │             │        │   │
│  │       ▼             ▼             ▼             ▼        │   │
│  │  Preconfirm   Preconfirm   Preconfirm   Preconfirm      │   │
│  │  (~200ms)     (~450ms)     (~700ms)     (~950ms)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│                    Final Block with State Root                   │
│                         (2초 후 확정)                             │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Flashblocks vs 일반 확인 비교

| 항목 | 일반 확인 | Flashblocks |
|------|----------|-------------|
| 확인 시간 | 2초 | ~200ms |
| 신뢰도 | 최종 확정 | 사전 확인 (높은 신뢰도) |
| 최종 확정 | 동일 시점 | 2초 후 최종 확정 |
| 사용 사례 | 일반 트랜잭션 | 실시간 UX가 중요한 앱 |

### 6.4 Flashblocks 활용 사례

```tsx
// 일반 트랜잭션 (2초 대기)
const receipt = await sendTransaction(tx);
// 2초 후 확인

// Flashblocks 활용 (~200ms)
const { preconfirmation, result } = await flashblocks.sendTransaction(tx);
// ~200ms 후 preconfirmation 수신
console.log('사전 확인됨!', preconfirmation.preconfirmedAt);

// 2초 후 최종 확정
const finalReceipt = await result.wait();
```

### 6.5 Flashblocks의 장점

| 장점 | 설명 |
|------|------|
| **즉각적인 피드백** | 사용자에게 거의 즉시 트랜잭션 확인 제공 |
| **향상된 UX** | 게임, DEX 등 실시간 반응이 중요한 앱에 적합 |
| **기존 보안 유지** | 최종 확정은 여전히 2초 후 State Root와 함께 완료 |
| **EVM 호환** | 기존 코드 수정 없이 사용 가능 |

---

## 7. GIWA React Native SDK 개발 배경

### 7.1 왜 이 SDK를 만들었는가?

#### 문제 인식

1. **Web3 모바일 개발의 어려움**
   - React Native에서 블록체인 연동은 복잡한 설정 필요
   - viem, ethers 등 웹 라이브러리의 React Native 호환성 문제
   - 보안 저장소(Keychain/Keystore) 연동의 복잡성

2. **GIWA 체인 특화 기능 부재**
   - Flashblocks, GIWA ID, Dojang 등 GIWA 전용 기능 지원 필요
   - 네트워크 설정의 번거로움

3. **개발 생산성 저하**
   - 반복되는 보일러플레이트 코드
   - 지갑 관리, 트랜잭션 처리 등 공통 로직 중복

#### 해결책: @giwa/react-native-wallet

```
┌─────────────────────────────────────────────────────────────────┐
│                    Before (Without SDK)                          │
│                                                                  │
│  App Code                                                        │
│     │                                                            │
│     ├── viem 설정                                                │
│     ├── ethers 설정                                              │
│     ├── Keychain/Keystore 연동                                   │
│     ├── 네트워크 설정                                             │
│     ├── 지갑 생성/복구 로직                                       │
│     ├── 트랜잭션 처리 로직                                        │
│     ├── 토큰 처리 로직                                            │
│     ├── Bridge 로직                                              │
│     └── 에러 처리                                                 │
│                                                                  │
│  → 수천 줄의 보일러플레이트 코드                                    │
└─────────────────────────────────────────────────────────────────┘

                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                     After (With SDK)                             │
│                                                                  │
│  App Code                                                        │
│     │                                                            │
│     └── @giwa/react-native-wallet                               │
│              │                                                   │
│              ├── useGiwaWallet()   → 지갑 관리                    │
│              ├── useBalance()      → 잔액 조회                    │
│              ├── useTransaction()  → 트랜잭션                     │
│              ├── useFlashblocks()  → 초고속 확인                  │
│              ├── useGiwaId()       → GIWA ID                     │
│              └── useDojang()       → 증명                        │
│                                                                  │
│  → 간결하고 직관적인 Hook API                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 SDK 설계 원칙

#### Clean Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  React Hooks (useGiwaWallet, useBalance, useTransaction...) ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Managers (WalletManager, TokenManager, BridgeManager...)   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Infrastructure Layer                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Adapters (SecureStorage, Biometric, Clipboard)             ││
│  │  GiwaClient (viem wrapper)                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### 핵심 설계 원칙

| 원칙 | 적용 |
|------|------|
| **DRY (Don't Repeat Yourself)** | 공통 비동기 패턴을 `useAsyncAction`, `useAsyncQuery`로 추상화 |
| **SRP (Single Responsibility)** | 각 Manager와 Hook이 단일 책임만 담당 |
| **DIP (Dependency Inversion)** | Adapter 인터페이스를 통한 플랫폼 추상화 |
| **OCP (Open-Closed Principle)** | 확장에는 열려있고, 수정에는 닫혀있는 구조 |

### 7.3 SDK 주요 기능

#### 지갑 관리
```tsx
const { wallet, createWallet, recoverWallet } = useGiwaWallet();

// 새 지갑 생성
const { wallet, mnemonic } = await createWallet();

// 시드 구문으로 복구
const recoveredWallet = await recoverWallet(mnemonic);
```

#### 잔액 조회
```tsx
const { balance, formattedBalance, refetch } = useBalance();
// balance: 1000000000000000000n (wei)
// formattedBalance: "1.0" (ETH)
```

#### Flashblocks 트랜잭션
```tsx
const { sendTransaction } = useFlashblocks();

const { preconfirmation, result } = await sendTransaction({
  to: '0x...',
  value: parseEther('0.1'),
});

// ~200ms 후
console.log('Preconfirmed!', preconfirmation.preconfirmedAt);
```

#### GIWA ID 해석
```tsx
const { resolveAddress, resolveName } = useGiwaId();

const address = await resolveAddress('alice.giwa.id');
const name = await resolveName('0x...');
```

### 7.4 플랫폼 호환성

```
┌─────────────────────────────────────────────────────────────────┐
│                    @giwa/react-native-wallet                     │
│                                                                  │
│  ┌───────────────────────┐    ┌───────────────────────┐         │
│  │        Expo           │    │    React Native CLI   │         │
│  │                       │    │                       │         │
│  │  expo-secure-store    │    │  react-native-keychain│         │
│  │  expo-local-auth      │    │  react-native-biometrics│       │
│  │  expo-clipboard       │    │  @react-native-clipboard│       │
│  └───────────────────────┘    └───────────────────────┘         │
│              │                          │                        │
│              └──────────┬───────────────┘                        │
│                         │                                        │
│                         ▼                                        │
│              ┌─────────────────────┐                             │
│              │   Adapter Factory   │                             │
│              │   (Auto Detection)  │                             │
│              └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

SDK는 실행 환경을 자동으로 감지하여 적절한 네이티브 모듈을 사용합니다:

| 기능 | Expo | React Native CLI |
|------|------|------------------|
| 보안 저장소 | expo-secure-store | react-native-keychain |
| 생체 인증 | expo-local-authentication | react-native-biometrics |
| 클립보드 | expo-clipboard | @react-native-clipboard/clipboard |

### 7.5 보안 고려사항

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Architecture                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Application Layer                         ││
│  │  - 민감한 데이터는 절대 메모리에 평문으로 보관하지 않음          ││
│  │  - 니모닉/개인키는 사용 후 즉시 메모리에서 제거                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Secure Storage                            ││
│  │                                                              ││
│  │  iOS: Keychain (Hardware-backed)                            ││
│  │  ├── kSecAttrAccessibleWhenUnlockedThisDeviceOnly           ││
│  │  └── Secure Enclave (if available)                          ││
│  │                                                              ││
│  │  Android: Keystore (Hardware-backed)                        ││
│  │  ├── AndroidKeyStore provider                               ││
│  │  └── StrongBox (if available)                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Biometric Protection                      ││
│  │  - 트랜잭션 서명 시 생체 인증 요구                             ││
│  │  - Face ID / Touch ID / Fingerprint                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. 참고 자료

### 공식 문서

- [GIWA 공식 문서](https://docs.giwa.io)
- [Optimism 문서](https://docs.optimism.io)
- [OP Stack 문서](https://stack.optimism.io)
- [Ethereum 공식 문서](https://ethereum.org/developers)

### 기술 자료

- [Flashblocks Deep Dive - Optimism](https://www.optimism.io/blog/flashblocks-deep-dive-250ms-preconfirmations-on-op-mainnet)
- [Flashblocks Deep Dive: How we made Base 10x faster](https://blog.base.dev/flashblocks-deep-dive)
- [OP Stack Flashblocks and the Evolution of L2 Architecture - Gelato](https://gelato.cloud/blog/op-stack-flashblocks-and-the-evolution-of-l2-architecture)
- [How Do Optimistic Rollups Work - Alchemy](https://www.alchemy.com/overviews/optimistic-rollups)
- [L2BEAT - Layer 2 생태계 현황](https://l2beat.com/)

### 개발 도구

- [viem - TypeScript Ethereum 라이브러리](https://viem.sh)
- [wagmi - React Hooks for Ethereum](https://wagmi.sh)

---

## 마치며

GIWA 체인은 OP Stack 기반의 이더리움 Layer 2로서, Web3의 진입 장벽을 낮추고 누구나 쉽게 블록체인을 활용할 수 있는 인프라를 제공합니다.

`@giwa/react-native-wallet` SDK는 이러한 GIWA 체인의 기능을 React Native 앱에서 쉽게 활용할 수 있도록 설계되었습니다. 복잡한 블록체인 연동 로직을 추상화하고, 직관적인 Hook API를 통해 개발자들이 비즈니스 로직에 집중할 수 있도록 돕습니다.

기와(GIWA)가 작은 조각들이 모여 견고한 지붕을 이루듯, 이 SDK가 GIWA 생태계 위에서 다양한 애플리케이션들이 꽃피울 수 있는 기반이 되기를 바랍니다.
