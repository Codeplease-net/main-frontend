import duydo from "../../public/duydo.png";
import khangnguyen from "../../public/khangnguyen.jpg";
import vuvo from "../../public/vuvo.jpg";

export function topics_list(t: any) {
    return [
      { university: "University of Information Technology - VNUHCM", name: "Phuong-Duy Do", image: duydo, roles: ['Frontend'], githubLink: "https://github.com/dpduy123", linkedinLink: "", websiteLink:"" },
      { university: "Swinburne Vietnam - HCMC Campus", name: "Vinh-Khang Nguyen", image: khangnguyen, roles: ['Frontend'], githubLink: "https://github.com/katiue", linkedinLink: "", websiteLink:"" },
      { university: "Vietnamese-German University", name: "Minh-Quan Chau", roles: ['Judge-server'], githubLink: "https://github.com/CallMeQan", linkedinLink: "", websiteLink:"" },
      { university: "University of Information Technology - VNUHCM", name: "Zhang Shan", roles: ['Frontend', 'Backend'], githubLink: "", linkedinLink: "", websiteLink:"" },
      { university: "University of Information Technology - VNUHCM", name: "Quang-Vu Vo", image: vuvo, roles: ['Backend'], githubLink: "https://github.com/threalwinky", linkedinLink: "https://www.linkedin.com/in/threalwinky/", websiteLink:"https://winky9116.github.io" }
    ];
  }