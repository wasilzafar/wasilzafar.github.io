// ============================================================
// CCIE Enterprise Infrastructure — Syllabus
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['ccie'] = {
    examName: 'CCIE Enterprise Infrastructure',
    version: '2026',
    sections: [
        {
            id: 'ccie-network',
            name: 'Network Infrastructure',
            type: 'compulsory',
            topics: [
                { id: 'net-switching', title: 'Switched Campus (STP, VLANs, EtherChannel, StackWise)', difficulty: 3, estimatedHours: 18, tags: ['switching'] },
                { id: 'net-routing', title: 'Routing Protocols (OSPF, EIGRP, BGP, IS-IS, Route Maps)', difficulty: 5, estimatedHours: 36, weight: 1.3, tags: ['routing'] },
                { id: 'net-mpls', title: 'MPLS & Segment Routing (LDP, TE, SR-MPLS, SRv6)', difficulty: 5, estimatedHours: 24, weight: 1.3, tags: ['mpls'] },
                { id: 'net-multicast', title: 'Multicast (PIM, IGMP, Rendezvous Points, MSDP)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['multicast'] },
                { id: 'net-wan', title: 'WAN Technologies (SD-WAN, DMVPN, FlexVPN, GRE)', difficulty: 4, estimatedHours: 20, weight: 1.2, tags: ['wan'] }
            ]
        },
        {
            id: 'ccie-sdwan',
            name: 'SD-WAN / SD-Access',
            type: 'compulsory',
            topics: [
                { id: 'sd-wan-arch', title: 'SD-WAN Architecture (vManage, vSmart, vBond, vEdge/cEdge)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['sd-wan'] },
                { id: 'sd-wan-policies', title: 'SD-WAN Policies (App-Aware Routing, QoS, Security)', difficulty: 4, estimatedHours: 16, tags: ['sd-wan'] },
                { id: 'sd-access', title: 'SD-Access (DNA Center, LISP, VXLAN, CTS/SGT)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['sd-access'] }
            ]
        },
        {
            id: 'ccie-transport',
            name: 'Transport & Tunneling',
            type: 'compulsory',
            topics: [
                { id: 'trans-vxlan', title: 'VXLAN/EVPN (Fabric, Multi-Site)', difficulty: 5, estimatedHours: 20, weight: 1.3, tags: ['transport'] },
                { id: 'trans-qos', title: 'QoS (Classification, Marking, Queuing, Shaping, Policing)', difficulty: 4, estimatedHours: 18, weight: 1.2, tags: ['qos'] },
                { id: 'trans-ipv6', title: 'IPv6 (Addressing, DHCPv6, OSPFv3, Transition Mechanisms)', difficulty: 3, estimatedHours: 14, tags: ['ipv6'] }
            ]
        },
        {
            id: 'ccie-security',
            name: 'Infrastructure Security',
            type: 'compulsory',
            topics: [
                { id: 'sec-aaa', title: 'AAA (RADIUS, TACACS+, ISE Integration)', difficulty: 3, estimatedHours: 12, tags: ['security'] },
                { id: 'sec-device', title: 'Device Hardening (CoPP, uRPF, ACLs, Control Plane)', difficulty: 3, estimatedHours: 14, weight: 1.2, tags: ['security'] },
                { id: 'sec-infra', title: 'Infrastructure Security (MACsec, IPsec, 802.1X, TrustSec)', difficulty: 4, estimatedHours: 16, weight: 1.2, tags: ['security'] }
            ]
        },
        {
            id: 'ccie-automation',
            name: 'Automation & Programmability',
            type: 'compulsory',
            topics: [
                { id: 'auto-netconf', title: 'NETCONF/RESTCONF, YANG Models', difficulty: 4, estimatedHours: 14, tags: ['automation'] },
                { id: 'auto-python', title: 'Python Scripting & API Automation (REST, gRPC)', difficulty: 3, estimatedHours: 16, weight: 1.2, tags: ['automation'] },
                { id: 'auto-ansible', title: 'Ansible / Terraform for Network Infrastructure', difficulty: 3, estimatedHours: 12, tags: ['automation'] },
                { id: 'auto-telemetry', title: 'Model-Driven Telemetry & Streaming', difficulty: 3, estimatedHours: 10, tags: ['automation'] }
            ]
        }
    ]
};
