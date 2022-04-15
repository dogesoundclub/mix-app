import { DomNode } from "skydapp-browser";
interface GovernanceProposalOption {
    title: string;
    voters: string[];
    revoters?: string[];
}
interface GovernanceProposal {
    id: string;
    proposer: string;
    title: string;
    summary: string;
    content: string;
    note: string;
    passed: boolean;
    passTime?: number;
    rejected?: boolean;
    rejectReason?: string;
    startRevoteTime?: number;
    voters: string[];
    revoters?: string[];
    options: GovernanceProposalOption[];
}
export default class Proposal extends DomNode {
    constructor(proposal: GovernanceProposal);
}
export { };
//# sourceMappingURL=Proposal.d.ts.map