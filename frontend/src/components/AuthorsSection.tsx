// src/components/AuthorsSection.tsx
import "./AuthorsSection.css";

type Author = {
  name: string;
  role: string;
  bio: string;
  photo: string;      // путь до картинки в /public или import
  email?: string;
  linkedin?: string;
  github?: string;
};

const AUTHORS: Author[] = [
  {
    name: "Асылбек Ғизатов",
    role: "Научный руководитель",
    bio: "Научный руководитель",
    photo: "/authors/Assylbek.jpg",
    linkedin: "https://www.linkedin.com/in/assylbek-gizatov-039193284/"
  },
  {
    name: "Ізбасар Орынбасар",
    role: "Full-Stack Developer",
    bio: "Магистрант 1 курса, разработка backend и frontend частей проекта.",
    photo: "/authors/Izbassar.jpg",
    linkedin: "https://www.linkedin.com/in/izbassar/",
    github: "https://github.com/IzbassarO"
  },
  {
    name: "Имя Фамилия",
    role: "Researcher",
    bio: "Бакалавр 3 курс",
    photo: "/authors/a3.jpg"
  }
];

export default function AuthorsSection() {
  return (
    <section className="authors">
      <h3 className="authors-title">Авторы проекта</h3>
      <div className="authors-grid">
        {AUTHORS.map((a) => (
          <article className="author-card" key={a.name}>
            <div className="author-photo-wrap">
              <img className="author-photo" src={a.photo} alt={a.name} />
            </div>
            <h4 className="author-name">{a.name}</h4>
            <div className="author-role">{a.role}</div>
            <p className="author-bio">{a.bio}</p>
            <div className="author-links">
              {a.linkedin && <a href={a.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {a.github && <a href={a.github} target="_blank" rel="noreferrer">GitHub</a>}
              {a.email && <a href={`mailto:${a.email}`}>Email</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
