import { describe, expect, it } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe("Create Appointment", () => {
  it("should be able to create an appointment", () => {
    const startsAt = getFutureDate("2022-07-17")
    const endsAt = getFutureDate("2022-07-18")

    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository);

    expect(createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment);
  })

  it("should not be able to create an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2023-07-10")
    const endsAt = getFutureDate("2023-07-15")

    const appointmentsRepository = new InMemoryAppointmentsRepository()
    const createAppointment = new CreateAppointment(appointmentsRepository);

    await createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt
    })

    expect(createAppointment.execute({
      customer: "John Doe",
      startsAt: getFutureDate("2023-07-14"),
      endsAt: getFutureDate("2023-07-18")
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: "John Doe",
      startsAt: getFutureDate("2023-07-08"),
      endsAt: getFutureDate("2023-07-12")
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: "John Doe",
      startsAt: getFutureDate("2023-07-08"),
      endsAt: getFutureDate("2023-07-17")
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: "John Doe",
      startsAt: getFutureDate("2023-07-11"),
      endsAt: getFutureDate("2023-07-14")
    })).rejects.toBeInstanceOf(Error)
  })
})