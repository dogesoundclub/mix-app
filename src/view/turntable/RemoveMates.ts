
import { DomNode, el } from "skydapp-browser";
import { View, ViewParams } from "skydapp-common";
import MateList from "../../component/mate/MateList";
import MateContract from "../../contracts/nft/MateContract";
import MatesListenersContract from "../../contracts/turntable/MatesListenersContract";
import Wallet from "../../klaytn/Wallet";
import Layout from "../Layout";
import ViewUtil from "../ViewUtil";

export default class RemoveMates implements View {

    private container: DomNode;
    private selectedMates: DomNode;
    private mateList: MateList;

    constructor(params: ViewParams) {
        const turntableId = parseInt(params.id as string, 10);
        Layout.current.title = "턴테이블에 메이트 등록 취소";
        Layout.current.content.append(this.container = el(".add-mates-to-turntable-view",
            el("h1", "턴테이블에 메이트 등록 취소하기"),
            el("p", "해당 턴테이블에서 더 이상 리스너로 등록되지 않을 메이트를 선택해주시기 바랍니다."),
            this.selectedMates = el(".selected-mates", "선택된 메이트 갯수 : {count}개".replace(/{count}/, String(0))),
            el(".button-container", el("a", "▶ 최대로 선택하기", {
                click: () => this.mateList.maxSelect(),
            })),
            el(".button-container", el("a", "▶ 전체 선택 해제", {
                click: () => this.mateList.deselect(),
            })),
            this.mateList = new MateList(true, false),
            el("button.submit-button", "메이트 등록 취소", {
                click: async () => {
                    await MatesListenersContract.unlisten(
                        turntableId, this.mateList.selectedMateIds,
                    );
                    setTimeout(() => ViewUtil.go(`/turntable/${turntableId}`), 2000);
                },
            }),
        ));

        this.load(turntableId);
        this.mateList.on("selectMate", () => {
            this.selectedMates.empty().appendText("선택된 메이트 갯수 : {count}개".replace(/{count}/, String(this.mateList.selectedMateIds.length)));
        });
    }

    private async load(turntableId: number) {
        const walletAddress = await Wallet.loadAddress();
        if (walletAddress !== undefined) {
            const mateBalance = (await MateContract.balanceOf(walletAddress)).toNumber();

            const mates: number[] = [];
            const votedMates: number[] = [];

            const promises: Promise<void>[] = [];
            for (let i = 0; i < mateBalance; i += 1) {
                const promise = async (index: number) => {
                    const mateId = (await MateContract.tokenOfOwnerByIndex(walletAddress, index)).toNumber();
                    mates.push(mateId);
                    if (
                        await MatesListenersContract.listening(mateId) !== true ||
                        (await MatesListenersContract.listeningTo(mateId)).toNumber() !== turntableId
                    ) {
                        votedMates.push(mateId);
                    }
                };
                promises.push(promise(i));
            }
            await Promise.all(promises);

            this.mateList.load(mates, votedMates);
        }
    }

    public changeParams(params: ViewParams, uri: string): void { }

    public close(): void {
        this.container.delete();
    }
}
